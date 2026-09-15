import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AIRPORTS, CabinClass, searchFlightDeals } from "@/lib/flights";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");
  const cabin = (searchParams.get("cabin") || "economy") as CabinClass;
  const passengers = Number(searchParams.get("passengers") || 1);

  if (!origin || !destination || !date) {
    return NextResponse.json({ airports: AIRPORTS, sites: [] });
  }

  try {
    const result = searchFlightDeals({
      origin,
      destination,
      date,
      returnDate,
      cabin,
      passengers,
    });
    return NextResponse.json({ airports: AIRPORTS, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not search flights" },
      { status: 400 },
    );
  }
}
