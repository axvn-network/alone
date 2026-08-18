/**
 * src/services/shareholder-ops.service.ts
 *
 * Business logic cho toàn bộ Shareholder Operations:
 *   - Tasks (nhiệm vụ)
 *   - Meetings (cuộc họp)
 *   - Messages (nhắn tin kênh)
 *
 * Route handlers gọi service này thay vì truy cập model trực tiếp.
 * Hệ thống SSE broadcast được gọi sau mỗi mutation tin nhắn.
 */

import { connectDB } from "@/core/database";
import ShareholderTask, {
  IShareholderTask,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "@/core/models/ShareholderTask";
import ShareholderMeeting, {
  IShareholderMeeting,
  MeetingStatus,
  MeetingType,
} from "@/core/models/ShareholderMeeting";
import ShareholderMessage, {
  IShareholderMessage,
  MessageChannel,
} from "@/core/models/ShareholderMessage";
import { broadcast } from "@/shared/utils/sse-broker";
import { Types } from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaskQuery {
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: TaskPriority;
  assignedTo?: string;          // Shareholder ObjectId string
  assignedRole?: string;        // role string
  milestoneTag?: string;
  page?: number;
  limit?: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string[];
  assignedRoles?: string[];
  dueDate?: string | null;
  milestoneTag?: string;
  legalRef?: string;
  order?: number;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  completedAt?: string | null;
  completedBy?: string | null;
}

export interface MeetingQuery {
  status?: MeetingStatus;
  type?: MeetingType;
  fromDate?: string;
  toDate?: string;
  invitedRole?: string;
}

export interface CreateMeetingDto {
  title: string;
  type?: MeetingType;
  status?: MeetingStatus;
  scheduledAt: string | Date;
  location?: string;
  meetingLink?: string;
  invitedRoles?: string[];
  agenda?: {
    order: number;
    title: string;
    description?: string;
    voteOptions?: { label: string }[];
    resolved?: boolean;
    resolution?: string;
  }[];
  minutes?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export type UpdateMeetingDto = Partial<CreateMeetingDto>;

export interface MessageQuery {
  channel?: MessageChannel;
  limit?: number;
  before?: string;    // ISO date — cursor-based pagination
}

export interface SendMessageDto {
  channel: MessageChannel;
  content: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  isAdminSender?: boolean;
  replyTo?: string | null;
  attachmentUrl?: string;
  attachmentName?: string;
}

// ─── Task service ─────────────────────────────────────────────────────────────

export const taskService = {
  /** Lấy tất cả tasks (admin view) */
  async list(query: TaskQuery = {}) {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.priority) filter.priority = query.priority;
    if (query.milestoneTag) filter.milestoneTag = query.milestoneTag;
    if (query.assignedTo) filter.assignedTo = new Types.ObjectId(query.assignedTo);
    if (query.assignedRole) filter.assignedRoles = query.assignedRole;

    const page  = Math.max(1, query.page  || 1);
    const limit = Math.min(200, Math.max(1, query.limit || 200));

    const [docs, total] = await Promise.all([
      ShareholderTask.find(filter).sort({ order: 1, createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      ShareholderTask.countDocuments(filter),
    ]);
    return { tasks: docs, total, page, limit };
  },

  /** Tasks hiển thị cho một cổ đông cụ thể (filter theo id/role) */
  async listForShareholder(shareholderId: string, role: string) {
    await connectDB();
    return ShareholderTask.find({
      $or: [
        { assignedTo: new Types.ObjectId(shareholderId) },
        { assignedRoles: role },
        { assignedRoles: { $size: 0 } },
      ],
    }).sort({ order: 1, createdAt: 1 }).lean();
  },

  async create(data: CreateTaskDto) {
    await connectDB();
    const doc = await ShareholderTask.create({
      ...data,
      assignedTo: (data.assignedTo || []).map((id) => new Types.ObjectId(id)),
    });
    return doc.toObject();
  },

  async update(id: string, data: UpdateTaskDto) {
    await connectDB();
    const update: Record<string, unknown> = { ...data };
    if (data.assignedTo) {
      update.assignedTo = data.assignedTo.map((i) => new Types.ObjectId(i));
    }
    const doc = await ShareholderTask.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!doc) throw new Error("Task not found");
    return doc.toObject();
  },

  async markDone(taskId: string, shareholderId: string, role: string) {
    await connectDB();
    const doc = await ShareholderTask.findOneAndUpdate(
      { _id: taskId, $or: [{ assignedTo: new Types.ObjectId(shareholderId) }, { assignedRoles: role }] },
      { $set: { status: "done", completedAt: new Date(), completedBy: new Types.ObjectId(shareholderId) } },
      { new: true }
    );
    if (!doc) throw new Error("Task not found or access denied");
    return doc.toObject();
  },

  async remove(id: string) {
    await connectDB();
    await ShareholderTask.findByIdAndDelete(id);
    return true;
  },

  async getStats() {
    await connectDB();
    const [total, done, inProgress, blocked] = await Promise.all([
      ShareholderTask.countDocuments(),
      ShareholderTask.countDocuments({ status: "done" }),
      ShareholderTask.countDocuments({ status: "in_progress" }),
      ShareholderTask.countDocuments({ status: "blocked" }),
    ]);
    return { total, done, inProgress, blocked, pending: total - done - inProgress - blocked };
  },
};

// ─── Meeting service ──────────────────────────────────────────────────────────

export const meetingService = {
  async list(query: MeetingQuery = {}) {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.invitedRole) filter.invitedRoles = query.invitedRole;
    if (query.fromDate || query.toDate) {
      filter.scheduledAt = {};
      if (query.fromDate) (filter.scheduledAt as Record<string, unknown>).$gte = new Date(query.fromDate);
      if (query.toDate)   (filter.scheduledAt as Record<string, unknown>).$lte = new Date(query.toDate);
    }
    return ShareholderMeeting.find(filter).sort({ scheduledAt: -1 }).lean();
  },

  /** Họp dành cho một cổ đông (filter invitedRoles/attendees) */
  async listForShareholder(shareholderId: string, role: string) {
    await connectDB();
    return ShareholderMeeting.find({
      $or: [
        { invitedRoles: role },
        { invitedRoles: { $size: 0 } },
        { attendees: new Types.ObjectId(shareholderId) },
      ],
    }).sort({ scheduledAt: -1 }).lean();
  },

  async create(data: CreateMeetingDto) {
    await connectDB();
    const doc = await ShareholderMeeting.create(data);
    return doc.toObject();
  },

  async update(id: string, data: UpdateMeetingDto) {
    await connectDB();
    const doc = await ShareholderMeeting.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!doc) throw new Error("Meeting not found");
    return doc.toObject();
  },

  async remove(id: string) {
    await connectDB();
    await ShareholderMeeting.findByIdAndDelete(id);
    return true;
  },
};

// ─── Message service ──────────────────────────────────────────────────────────

export const messageService = {
  async list(query: MessageQuery = {}) {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (query.channel) filter.channel = query.channel;
    if (query.before)  filter.createdAt = { $lt: new Date(query.before) };

    const limit = Math.min(200, Math.max(1, query.limit || 50));
    const msgs = await ShareholderMessage.find(filter)
      .sort({ createdAt: -1 }).limit(limit).lean();
    return msgs.reverse();
  },

  async send(data: SendMessageDto) {
    await connectDB();
    const msg = await ShareholderMessage.create({
      channel:        data.channel,
      sender:         new Types.ObjectId(data.senderId),
      senderName:     data.senderName,
      senderRole:     data.senderRole || "",
      isAdminSender:  data.isAdminSender ?? false,
      content:        data.content.trim(),
      replyTo:        data.replyTo ? new Types.ObjectId(data.replyTo) : null,
      attachmentUrl:  data.attachmentUrl || "",
      attachmentName: data.attachmentName || "",
      readBy:         [new Types.ObjectId(data.senderId)],
    });
    const plain = msg.toObject();
    // Broadcast SSE: channel room = "sh-messages-{channel}"
    broadcast(`sh-messages-${data.channel}`, "message", plain);
    // Also broadcast to admin SSE room for notification
    broadcast("admin", "shareholder_message", { channel: data.channel, senderName: data.senderName });
    return plain;
  },

  async markRead(channel: string, shareholderId: string) {
    await connectDB();
    await ShareholderMessage.updateMany(
      { channel, readBy: { $ne: new Types.ObjectId(shareholderId) } },
      { $addToSet: { readBy: new Types.ObjectId(shareholderId) } }
    );
  },

  async getUnreadCount(shareholderId: string) {
    await connectDB();
    return ShareholderMessage.countDocuments({
      readBy: { $ne: new Types.ObjectId(shareholderId) },
    });
  },
};

// ─── Re-export types from models for convenience ─────────────────────────────
export type { IShareholderTask, IShareholderMeeting, IShareholderMessage };
export type { TaskStatus, TaskPriority, TaskCategory, MeetingStatus, MeetingType, MessageChannel };
