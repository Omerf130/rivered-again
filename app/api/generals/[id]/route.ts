import { NextRequest, NextResponse } from "next/server";
import { deleteGeneral } from "@/lib/generals";

// DELETE - Delete a general
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {   // 👈 VERY IMPORTANT
  try {
    const { id } = params;
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
