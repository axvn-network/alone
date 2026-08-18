/**
 * src/modules/shareholders/index.ts
 * Barrel export — import from "@/modules/shareholders"
 *
 * Exports:
 *   - Shareholder model + types
 *   - Sub-models: Task, Meeting, Message
 *   - Services: taskService, meetingService, messageService
 */

// ── Shareholder model ─────────────────────────────────────────────────────────
export { default as ShareholderModel } from "./model";
export type { IShareholder, ShareholderRole, ShareholderStatus } from "./model";

// ── Sub-models ────────────────────────────────────────────────────────────────
export { default as ShareholderTask } from "./task.model";
export type {
  IShareholderTask,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "./task.model";

export { default as ShareholderMeeting } from "./meeting.model";
export type {
  IShareholderMeeting,
  MeetingStatus,
  MeetingType,
} from "./meeting.model";

export { default as ShareholderMessage } from "./message.model";
export type { IShareholderMessage, MessageChannel } from "./message.model";

// ── CRUD Service (Shareholder document operations) ───────────────────────────
export {
  list,
  getById,
  create,
  update,
  remove,
  approveKyc,
  rejectKyc,
  shareholderService,
} from "./shareholder.service";
export type { ShareholderQuery } from "./shareholder.service";

// ── Ops Services (Tasks, Meetings, Messages) ──────────────────────────────────
export { taskService, meetingService, messageService } from "./service";
export type {
  TaskQuery,
  CreateTaskDto,
  UpdateTaskDto,
  MeetingQuery,
  CreateMeetingDto,
  UpdateMeetingDto,
  MessageQuery,
  SendMessageDto,
} from "./service";

// ── Schema & Actions ──────────────────────────────────────────────────────────
export { shareholderSchema } from "./schema";
export type { ShareholderInput } from "./schema";
export * from "./actions";
