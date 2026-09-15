import { AIRPORTS, Airport, findAirport, airportShortLabel } from "@/lib/airports";

export type { Airport };
export { AIRPORTS, findAirport, airportShortLabel };

export type CabinClass = "economy" | "premium" | "business";

export type BookingKind = "cheap" | "best" | "airline";

export type BookingSite = {
  id: string;
  name: string;
  kind: BookingKind;
  label: string;
  url: string;
  website: string;
};

export type FlightSearchResult = {
  origin: Airport;
  destination: Airport;
  date: string;
  returnDate: string | null;
  cabin: CabinClass;
  passengers: number;
  sites: BookingSite[];
};

const AIRLINES: {
  code: string;
  name: string;
  website: string;
  bookUrl: (input: {
    origin: Airport;
    destination: Airport;
    date: string;
    returnDate: string | null;
    cabin: CabinClass;
    passengers: number;
  }) => string;
}[] = [
  {
    code: "QR",
    name: "Qatar Airways",
    website: "qatarairways.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.qatarairways.com/en/booking.html?from=${origin.code}&to=${destination.code}&departing=${date}`,
  },
  {
    code: "EK",
    name: "Emirates",
    website: "emirates.com",
    bookUrl: ({ origin, destination, date, passengers }) =>
      `https://www.emirates.com/english/book/?origin=${origin.code}&destination=${destination.code}&departing=${date}&adults=${passengers}&journeyType=O`,
  },
  {
    code: "TK",
    name: "Turkish Airlines",
    website: "turkishairlines.com",
    bookUrl: ({ origin, destination, date, passengers }) =>
      `https://www.turkishairlines.com/en-int/flights/booking/?from=${origin.code}&to=${destination.code}&departureDate=${date}&adult=${passengers}`,
  },
  {
    code: "ET",
    name: "Ethiopian Airlines",
    website: "ethiopianairlines.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.ethiopianairlines.com/aa/book?from=${origin.code}&to=${destination.code}&depart=${date}`,
  },
  {
    code: "KQ",
    name: "Kenya Airways",
    website: "kenya-airways.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.kenya-airways.com/en/book/?from=${origin.code}&to=${destination.code}&date=${date}`,
  },
  {
    code: "FZ",
    name: "flydubai",
    website: "flydubai.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.flydubai.com/en/book?origin=${origin.code}&destination=${destination.code}&departDate=${date}`,
  },
  {
    code: "BA",
    name: "British Airways",
    website: "britishairways.com",
    bookUrl: ({ origin, destination, date, passengers }) =>
      `https://www.britishairways.com/travel/book/public/en_us?from=${origin.code}&to=${destination.code}&depart=${date}&ad=${passengers}`,
  },
  {
    code: "LH",
    name: "Lufthansa",
    website: "lufthansa.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.lufthansa.com/us/en/homepage?origin=${origin.code}&destination=${destination.code}&departure=${date}`,
  },
  {
    code: "AF",
    name: "Air France",
    website: "airfrance.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://wwws.airfrance.us/search?origin=${origin.code}&destination=${destination.code}&date=${date}`,
  },
  {
    code: "KL",
    name: "KLM",
    website: "klm.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.klm.com/search?origin=${origin.code}&destination=${destination.code}&date=${date}`,
  },
  {
    code: "SQ",
    name: "Singapore Airlines",
    website: "singaporeair.com",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.singaporeair.com/en_UK/book/?from=${origin.code}&to=${destination.code}&depart=${date}`,
  },
  {
    code: "JL",
    name: "Japan Airlines",
    website: "jal.co.jp",
    bookUrl: ({ origin, destination, date }) =>
      `https://www.jal.co.jp/en/inter/?from=${origin.code}&to=${destination.code}&date=${date}`,
  },
];

export function formatAirport(airport: Airport) {
  return airportShortLabel(airport);
}

function skyDate(date: string) {
  return date.replace(/-/g, "").slice(2);
}

function cabinLabel(cabin: CabinClass) {
  if (cabin === "premium") return "premium economy";
  return cabin;
}

function skyCabin(cabin: CabinClass) {
  if (cabin === "premium") return "premiumeconomy";
  return cabin;
}

function googleQuery(input: {
  origin: Airport;
  destination: Airport;
  date: string;
  returnDate: string | null;
  cabin: CabinClass;
  passengers: number;
  sort: "cheap" | "best";
}) {
  const parts = [
    "Flights from",
    input.origin.code,
    "to",
    input.destination.code,
    "on",
    input.date,
  ];
  if (input.returnDate) {
    parts.push("returning", input.returnDate);
  } else {
    parts.push("one way");
  }
  parts.push(cabinLabel(input.cabin), `${input.passengers} passenger`);
  if (input.sort === "cheap") parts.push("cheapest");
  else parts.push("best");
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(parts.join(" "))}`;
}

function resolveSearch(input: {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string | null;
  cabin?: CabinClass;
  passengers?: number;
}) {
  const origin = findAirport(input.origin);
  const destination = findAirport(input.destination);
  const cabin = input.cabin ?? "economy";
  const passengers = input.passengers ?? 1;
  const returnDate = input.returnDate || null;

  if (!origin) throw new Error("Choose a valid origin airport");
  if (!destination) throw new Error("Choose a valid destination airport");
  if (origin.code === destination.code) {
    throw new Error("Origin and destination must be different");
  }
  if (!input.date) throw new Error("Travel date is required");
  if (passengers < 1 || passengers > 9) {
    throw new Error("Passengers must be between 1 and 9");
  }

  return { origin, destination, date: input.date, returnDate, cabin, passengers };
}

export function searchFlightDeals(input: {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string | null;
  cabin?: CabinClass;
  passengers?: number;
}): FlightSearchResult {
  const search = resolveSearch(input);
  const { origin, destination, date, returnDate, cabin, passengers } = search;
  const skyFrom = origin.code.toLowerCase();
  const skyTo = destination.code.toLowerCase();
  const skyPath = returnDate
    ? `${skyFrom}/${skyTo}/${skyDate(date)}/${skyDate(returnDate)}`
    : `${skyFrom}/${skyTo}/${skyDate(date)}`;
  const kayakPath = returnDate
    ? `${origin.code}-${destination.code}/${date}/${returnDate}`
    : `${origin.code}-${destination.code}/${date}`;

  const aggregators: BookingSite[] = [
    {
      id: "google-cheap",
      name: "Google Flights",
      kind: "cheap",
      label: "Cheapest fares",
      website: "google.com/travel/flights",
      url: googleQuery({ ...search, sort: "cheap" }),
    },
    {
      id: "skyscanner-cheap",
      name: "Skyscanner",
      kind: "cheap",
      label: "Compare cheap tickets",
      website: "skyscanner.com",
      url: `https://www.skyscanner.com/transport/flights/${skyPath}/?adultsv2=${passengers}&cabinclass=${skyCabin(cabin)}&rtn=${returnDate ? 1 : 0}`,
    },
    {
      id: "kayak-cheap",
      name: "Kayak",
      kind: "cheap",
      label: "Lowest price",
      website: "kayak.com",
      url: `https://www.kayak.com/flights/${kayakPath}?sort=price_a&adults=${passengers}`,
    },
    {
      id: "google-best",
      name: "Google Flights",
      kind: "best",
      label: "Best overall",
      website: "google.com/travel/flights",
      url: googleQuery({ ...search, sort: "best" }),
    },
    {
      id: "kayak-best",
      name: "Kayak",
      kind: "best",
      label: "Best flights",
      website: "kayak.com",
      url: `https://www.kayak.com/flights/${kayakPath}?sort=bestflight_a&adults=${passengers}`,
    },
    {
      id: "momondo-best",
      name: "Momondo",
      kind: "best",
      label: "Best value",
      website: "momondo.com",
      url: `https://www.momondo.com/flight-search/${kayakPath}?sort=bestflight_a&adults=${passengers}`,
    },
  ];

  const airlines: BookingSite[] = AIRLINES.map((airline) => ({
    id: `airline-${airline.code}`,
    name: airline.name,
    kind: "airline" as const,
    label: "Official airline site",
    website: airline.website,
    url: airline.bookUrl(search),
  }));

  return {
    origin,
    destination,
    date,
    returnDate,
    cabin,
    passengers,
    sites: [...aggregators, ...airlines],
  };
}

export function getBookingSite(
  id: string,
  input: {
    origin: string;
    destination: string;
    date: string;
    returnDate?: string | null;
    cabin?: CabinClass;
    passengers?: number;
  },
) {
  return searchFlightDeals(input).sites.find((site) => site.id === id) ?? null;
}

export function searchFlights(input: {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string | null;
  cabin?: CabinClass;
  passengers?: number;
}) {
  return searchFlightDeals(input);
}
