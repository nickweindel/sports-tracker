import { NextRequest, NextResponse } from "next/server";
import {
  API_BASE,
  API_PATH,
  FULL_GAME_SEARCH_PARAMETERS,
  isExtendedSearchParametersNeeded,
} from "@/lib/constants";
import { League } from "@/types/league";

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);

  // Get query parameters.
  const date = searchParams.get("date");

  //Get path parameters.
  const [, , sport, league] = pathname.split("/");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 },
    );
  }

  try {
    const collegeParams = isExtendedSearchParametersNeeded(league as League)
      ? FULL_GAME_SEARCH_PARAMETERS
      : "";
    const response = await fetch(
      `${API_BASE}/${sport}/${league}/${API_PATH}?dates=${date}${collegeParams}`,
    );

    if (!response.ok) {
      throw new Error(
        `${league} API responded with status: ${response.status}`,
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${league} data:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${league} data` },
      { status: 500 },
    );
  }
}
