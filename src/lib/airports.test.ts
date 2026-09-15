import { describe, expect, it } from "vitest";
import { AIRPORTS, airportLabel, findAirport, searchAirports } from "./airports";

describe("airport catalog", () => {
  it("includes major cities and airport names", () => {
    expect(AIRPORTS.length).toBeGreaterThan(150);
    expect(findAirport("London")?.code).toBe("LHR");
    expect(findAirport("Charles de Gaulle")?.code).toBe("CDG");
    expect(findAirport("Jomo Kenyatta")?.code).toBe("NBO");
    expect(airportLabel(findAirport("DOH")!).includes("Hamad")).toBe(true);
  });

  it("searches by city, code, and airport name", () => {
    const tokyo = searchAirports("tokyo");
    expect(tokyo.some((airport) => airport.code === "NRT")).toBe(true);
    expect(tokyo.some((airport) => airport.code === "HND")).toBe(true);
    expect(searchAirports("suvarnabhumi")[0]?.code).toBe("BKK");
    expect(findAirport("Some Unknown City")?.city).toBe("Some Unknown City");
  });
});
