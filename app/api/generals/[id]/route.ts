import { NextRequest } from "next/server";
import { deleteGeneral } from "@/lib/generals";

// DELETE - Delete a general
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteGeneral(id);
    return Response.json({
      ok: true,
      message: "General deleted successfully",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to delete general", error: error.message },
      { status: 500 }
    );
  }
}