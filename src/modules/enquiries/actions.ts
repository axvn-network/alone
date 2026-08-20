"use server";

/**
 * src/modules/enquiries/actions.ts
 * Server Actions — Enquiries / Hộp thư liên hệ
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import Enquiry from "@/modules/enquiries/model";
import { connectDB } from "@/core/database";

export async function markEnquiryReadAction(id: string) {
  await requireAuth();
  try {
    await connectDB();
    await Enquiry.findByIdAndUpdate(id, { status: "read" });
    revalidatePath("/admin/enquiries");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function archiveEnquiryAction(id: string) {
  await requireAuth();
  try {
    await connectDB();
    await Enquiry.findByIdAndUpdate(id, { status: "archived" });
    revalidatePath("/admin/enquiries");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function deleteEnquiryAction(id: string) {
  await requireAuth();
  try {
    await connectDB();
    await Enquiry.findByIdAndDelete(id);
    revalidatePath("/admin/enquiries");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
