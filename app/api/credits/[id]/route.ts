import { NextRequest, NextResponse } from "next/server";
import { deleteCredit, updateCredit } from "@/lib/credits";

// DELETE - Delete a credit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCredit(id);
    return Response.json({
      ok: true,
      message: "Credit deleted successfully",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to delete credit", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a credit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, amount } = body;

    // Validation
    if (!name || typeof name !== "string") {
      return Response.json(
        { ok: false, message: "Name is required" },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== "number") {
      return Response.json(
        { ok: false, message: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const updatedCredit = await updateCredit(id, { name, amount });

    return NextResponse.json({
      ok: true,
      message: "Credit updated successfully",
      data: updatedCredit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: "Failed to update credit", error: error.message },
      { status: 500 }
    );
  }
}