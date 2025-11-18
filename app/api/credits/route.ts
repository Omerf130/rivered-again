import { NextRequest } from "next/server";
import { getCredits, addCredit } from "@/lib/credits";

// GET - Fetch all credits
export async function GET() {
  try {
    const credits = await getCredits();
    return Response.json({
      ok: true,
      data: credits,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to fetch credits", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new credit
export async function POST(request: NextRequest) {
  try {
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

    const newCredit = await addCredit({ name, amount });

    return Response.json(
      {
        ok: true,
        message: "Credit created successfully",
        data: newCredit,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to create credit", error: error.message },
      { status: 500 }
    );
  }
}