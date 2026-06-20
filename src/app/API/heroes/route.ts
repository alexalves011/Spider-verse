import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.API_URL ?? "https://6a35c45a766b831960f8c26b.mockapi.io";
  const res = await fetch(new URL("/api/heroes", baseUrl).toString());

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch heroes" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
