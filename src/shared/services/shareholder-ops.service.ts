/**
 * src/services/shareholder-ops.service.ts — re-export shim
 * Canonical implementation lives at: @/modules/shareholders/service
 *
 * taskService, meetingService, messageService are the primary exports.
 * shareholderOpsService bundles them for callers that use the old namespace.
 */
export {
  taskService,
  meetingService,
  messageService,
} from "@/modules/shareholders";

export type {
  TaskQuery,
  CreateTaskDto,
  UpdateTaskDto,
  MeetingQuery,
  CreateMeetingDto,
  UpdateMeetingDto,
  MessageQuery,
  SendMessageDto,
} from "@/modules/shareholders";

// ─── Named bundle (compat: import { shareholderOpsService } from "@/shared/services") ─
import { taskService, meetingService, messageService } from "@/modules/shareholders";
export const shareholderOpsService = { taskService, meetingService, messageService };
