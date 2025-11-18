import { NextRequest } from "next/server";
import { deleteTransaction } from "@/lib/transactions";

// DELETE - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteTransaction(id);
    return Response.json({
      ok: true,
      message: "Transaction deleted successfully",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to delete transaction", error: error.message },
      { status: 500 }
    );
  }
}