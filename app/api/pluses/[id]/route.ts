import { NextRequest } from "next/server";
import { deletePlus } from "@/lib/pluses";

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