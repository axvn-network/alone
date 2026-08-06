import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    addSubmission({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || "",
      company: body.company || "",
      opportunityType: body.opportunityType,
      investmentRange: body.investmentRange || "",
      message: body.message,
      fileName: body.fileName || "",
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to submit" },
      { status: 400 }
    );
  }
}
