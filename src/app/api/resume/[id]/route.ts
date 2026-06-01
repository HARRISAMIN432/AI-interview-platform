export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { deleteResume } from "@/lib/actions/resume";
import { deleteS3Object } from "@/lib/s3/operations";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Changed to Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 },
      );
    }

    const { s3Key } = await deleteResume(id, userId);

    try {
      await deleteS3Object(s3Key);
    } catch (s3Err) {
      console.error(
        `[DELETE /api/resume/${id}] S3 delete failed for key ${s3Key}:`,
        s3Err,
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[DELETE /api/resume/:id] Error:`, message);

    if (message.includes("not found") || message.includes("access denied")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 },
    );
  }
}
