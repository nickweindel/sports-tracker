import { NextRequest, NextResponse } from "next/server";
import {
  API_BASE,
  API_PATH,
  FULL_GAME_SEARCH_PARAMETERS,
  isExtendedSearchParametersNeeded,
} from "@/lib/constants";
import { League } from "@/types/league";
import { EventList } from "@/types/game";
import { SelectOption } from "@/types/generic";

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);

  // Get query parameters.
  const date = searchParams.get("date");

  // Get path parameters.
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

    const data: EventList = await response.json();

    // Ensure events exist
    const events = Array.isArray(data?.events) ? data.events : [];

    // Only get events where the game is has gone final
    const finalEvents = events.filter(
      (event) => event.status.type.completed === true,
    );

    // Transform events → selector data
    const selectorOptions = finalEvents.map(
      (event) =>
        ({
          value: event.shortName,
          label: event.name,
        }) as SelectOption,
    );

    return NextResponse.json({ options: selectorOptions });
  } catch (error) {
    console.error(
      `Error fetching list of events for ${league} on ${date}:`,
      error,
    );
    return NextResponse.json(
      { error: `Failed to fetch list of events for ${league} on ${date}` },
      { status: 500 },
    );
  }
}
