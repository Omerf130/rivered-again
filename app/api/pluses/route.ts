import { NextRequest } from "next/server";
import { getPluses, addPlus } from "@/lib/pluses";

// GET - Fetch all pluses
export async function GET() {
  try {
    const pluses = await getPluses();
    return Response.json({
      ok: true,
      data: pluses,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to fetch pluses", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new plus
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

    const newPlus = await addPlus({ name, amount });

    return Response.json(
      {
        ok: true,
        message: "Plus created successfully",
        data: newPlus,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to create plus", error: error.message },
      { status: 500 }
    );
  }
}