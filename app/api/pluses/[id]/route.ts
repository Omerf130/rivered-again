import { NextRequest, NextResponse } from "next/server";
import { deletePlus, updatePlus } from "@/lib/pluses";

// DELETE - Delete a plus
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePlus(id);
    return Response.json({
      ok: true,
      message: "Plus deleted successfully",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to delete plus", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a plus
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

    const updatedPlus = await updatePlus(id, { name, amount });

    return NextResponse.json({
      ok: true,
      message: "Plus updated successfully",
      data: updatedPlus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: "Failed to update plus", error: error.message },
      { status: 500 }
    );
  }
}