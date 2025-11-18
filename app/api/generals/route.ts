import { NextRequest } from "next/server";
import { getGenerals, addGeneral } from "@/lib/generals";

// GET - Fetch all generals
export async function GET() {
  try {
    const generals = await getGenerals();
    return Response.json({
      ok: true,
      data: generals,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to fetch generals", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new general
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount } = body;

    // Validation
    if (!title || typeof title !== "string") {
      return Response.json(
        { ok: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== "number") {
      return Response.json(
        { ok: false, message: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const newGeneral = await addGeneral({ title, amount });

    return Response.json(
      {
        ok: true,
        message: "General created successfully",
        data: newGeneral,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "Failed to create general", error: error.message },
      { status: 500 }
    );
  }
}