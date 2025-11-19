import { NextRequest, NextResponse } from "next/server";
import { deleteGeneral, updateGeneral } from "@/lib/generals";

// DELETE - Delete a general
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {   // 👈 VERY IMPORTANT
  try {
    const { id } = await params;
    await deleteGeneral(id);

    return NextResponse.json({
      ok: true,
      message: "General deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to delete general",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// PUT - Update a general
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, amount } = body;

    // Validation
    if (!title || typeof title !== "string") {
      return Response.json(
        { ok: false, message: "title is required" },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== "number") {
      return Response.json(
        { ok: false, message: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const updatedGeneral = await updateGeneral(id, { title, amount });

    return NextResponse.json({
      ok: true,
      message: "general updated successfully",
      data: updatedGeneral,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: "Failed to update general", error: error.message },
      { status: 500 }
    );
  }
}
