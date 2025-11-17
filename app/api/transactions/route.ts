import { NextRequest } from "next/server";
import { getTransactions, addTransaction } from "@/lib/transactions";

// GET - Fetch all transactions
export async function GET() {
  try {
    const transactions = await getTransactions();
    return Response.json({
      ok: true,
      data: transactions,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction, amount } = body;

    // Validation
    if (!transaction || typeof transaction !== "string") {
      return Response.json(
        { ok: false, message: "Transaction description is required" },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== "number") {
      return Response.json(
        { ok: false, message: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const newTransaction = await addTransaction({ transaction, amount });

    return Response.json(
      {
        ok: true,
        message: "Transaction created successfully",
        data: newTransaction,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to create transaction", error: error.message },
      { status: 500 }
    );
  }
}