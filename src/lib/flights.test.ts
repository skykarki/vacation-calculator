import { describe, expect, it } from "vitest";
import {
  findAirport,
  formatAirport,
  getBookingSite,
  searchFlightDeals,
} from "./flights";

describe("findAirport", () => {
  it("matches airport codes and cities", () => {
    expect(findAirport("DOH")?.code).toBe("DOH");
    expect(findAirport("doha")?.code).toBe("DOH");
    expect(findAirport("Doha DOH")?.code).toBe("DOH");
    expect(findAirport("Mogadishu")?.code).toBe("MGQ");
    expect(findAirport("Hamad International")?.code).toBe("DOH");
    expect(findAirport("Narita")?.code).toBe("NRT");
    expect(findAirport("Heathrow")?.code).toBe("LHR");
    expect(findAirport("XYZ")?.code).toBe("XYZ");
  });
});

describe("searchFlightDeals", () => {
  it("returns real cheap, best, and airline booking sites", () => {
    const result = searchFlightDeals({
      origin: "Doha DOH",
      destination: "Mogadishu MGQ",
      date: "2026-10-10",
      cabin: "economy",
      passengers: 1,
    });
    expect(result.origin.code).toBe("DOH");
    expect(result.destination.code).toBe("MGQ");
    expect(formatAirport(result.origin)).toBe("Doha DOH");

    const google = result.sites.find((site) => site.id === "google-cheap");
    const skyscanner = result.sites.find((site) => site.id === "skyscanner-cheap");
    const kayak = result.sites.find((site) => site.id === "kayak-cheap");
    const qatar = result.sites.find((site) => site.id === "airline-QR");

    expect(google?.url).toContain("https://www.google.com/travel/flights");
    expect(google?.url).toContain("DOH");
    expect(google?.url).toContain("MGQ");
    expect(skyscanner?.url).toContain("https://www.skyscanner.com/transport/flights/doh/mgq/261010");
    expect(kayak?.url).toContain("https://www.kayak.com/flights/DOH-MGQ/2026-10-10");
    expect(kayak?.url).toContain("sort=price_a");
    expect(qatar?.url).toContain("https://www.qatarairways.com");
    expect(result.sites.some((site) => site.kind === "best")).toBe(true);
    expect(result.sites.some((site) => site.kind === "airline")).toBe(true);
  });

  it("rejects the same origin and destination", () => {
    expect(() =>
      searchFlightDeals({ origin: "DOH", destination: "DOH", date: "2026-10-10" }),
    ).toThrow("Origin and destination must be different");
  });
});

describe("getBookingSite", () => {
  it("reloads a searched booking site", () => {
    const input = {
      origin: "DOH",
      destination: "MGQ",
      date: "2026-10-10",
    };
    const site = getBookingSite("kayak-cheap", input);
    expect(site?.name).toBe("Kayak");
    expect(site?.url).toContain("kayak.com");
  });
});
