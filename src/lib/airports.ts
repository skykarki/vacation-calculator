export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

export const AIRPORTS: Airport[] = [
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { code: "DWC", city: "Dubai", name: "Al Maktoum International", country: "UAE" },
  { code: "SHJ", city: "Sharjah", name: "Sharjah International", country: "UAE" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "UAE" },
  { code: "MCT", city: "Muscat", name: "Muscat International", country: "Oman" },
  { code: "SLL", city: "Salalah", name: "Salalah Airport", country: "Oman" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia" },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia" },
  { code: "DMM", city: "Dammam", name: "King Fahd International", country: "Saudi Arabia" },
  { code: "MED", city: "Medina", name: "Prince Mohammad bin Abdulaziz", country: "Saudi Arabia" },
  { code: "BAH", city: "Manama", name: "Bahrain International", country: "Bahrain" },
  { code: "KWI", city: "Kuwait City", name: "Kuwait International", country: "Kuwait" },
  { code: "AMM", city: "Amman", name: "Queen Alia International", country: "Jordan" },
  { code: "BEY", city: "Beirut", name: "Rafic Hariri International", country: "Lebanon" },
  { code: "TLV", city: "Tel Aviv", name: "Ben Gurion", country: "Israel" },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },
  { code: "HRG", city: "Hurghada", name: "Hurghada International", country: "Egypt" },
  { code: "SSH", city: "Sharm El Sheikh", name: "Sharm El Sheikh International", country: "Egypt" },
  { code: "LXR", city: "Luxor", name: "Luxor International", country: "Egypt" },
  { code: "MGQ", city: "Mogadishu", name: "Aden Adde International", country: "Somalia" },
  { code: "HGA", city: "Hargeisa", name: "Egal International", country: "Somaliland" },
  { code: "BBO", city: "Berbera", name: "Berbera Airport", country: "Somaliland" },
  { code: "KMU", city: "Kismayo", name: "Kismayo Airport", country: "Somalia" },
  { code: "JIB", city: "Djibouti", name: "Djibouti-Ambouli", country: "Djibouti" },
  { code: "ADD", city: "Addis Ababa", name: "Bole International", country: "Ethiopia" },
  { code: "DIR", city: "Dire Dawa", name: "Dire Dawa Airport", country: "Ethiopia" },
  { code: "NBO", city: "Nairobi", name: "Jomo Kenyatta International", country: "Kenya" },
  { code: "MBA", city: "Mombasa", name: "Moi International", country: "Kenya" },
  { code: "EBB", city: "Entebbe", name: "Entebbe International", country: "Uganda" },
  { code: "KGL", city: "Kigali", name: "Kigali International", country: "Rwanda" },
  { code: "JRO", city: "Kilimanjaro", name: "Kilimanjaro International", country: "Tanzania" },
  { code: "DAR", city: "Dar es Salaam", name: "Julius Nyerere International", country: "Tanzania" },
  { code: "ZNZ", city: "Zanzibar", name: "Abeid Amani Karume International", country: "Tanzania" },
  { code: "JNB", city: "Johannesburg", name: "O. R. Tambo International", country: "South Africa" },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa" },
  { code: "DUR", city: "Durban", name: "King Shaka International", country: "South Africa" },
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed International", country: "Nigeria" },
  { code: "ABV", city: "Abuja", name: "Nnamdi Azikiwe International", country: "Nigeria" },
  { code: "ACC", city: "Accra", name: "Kotoka International", country: "Ghana" },
  { code: "DSS", city: "Dakar", name: "Blaise Diagne International", country: "Senegal" },
  { code: "ABJ", city: "Abidjan", name: "Felix Houphouet-Boigny", country: "Cote d'Ivoire" },
  { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco" },
  { code: "RAK", city: "Marrakech", name: "Marrakech Menara", country: "Morocco" },
  { code: "TUN", city: "Tunis", name: "Tunis-Carthage", country: "Tunisia" },
  { code: "ALG", city: "Algiers", name: "Houari Boumediene", country: "Algeria" },
  { code: "LAD", city: "Luanda", name: "Quatro de Fevereiro", country: "Angola" },
  { code: "MRU", city: "Port Louis", name: "Sir Seewoosagur Ramgoolam", country: "Mauritius" },
  { code: "SEZ", city: "Mahe", name: "Seychelles International", country: "Seychelles" },
  { code: "TNR", city: "Antananarivo", name: "Ivato International", country: "Madagascar" },
  { code: "FIH", city: "Kinshasa", name: "N'djili International", country: "DR Congo" },
  { code: "MPM", city: "Maputo", name: "Maputo International", country: "Mozambique" },
  { code: "HRE", city: "Harare", name: "Robert Gabriel Mugabe International", country: "Zimbabwe" },
  { code: "LUN", city: "Lusaka", name: "Kenneth Kaunda International", country: "Zambia" },
  { code: "WDH", city: "Windhoek", name: "Hosea Kutako International", country: "Namibia" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  { code: "SAW", city: "Istanbul", name: "Sabiha Gokcen", country: "Turkey" },
  { code: "ESB", city: "Ankara", name: "Esenboga", country: "Turkey" },
  { code: "AYT", city: "Antalya", name: "Antalya Airport", country: "Turkey" },
  { code: "ADB", city: "Izmir", name: "Adnan Menderes", country: "Turkey" },
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom" },
  { code: "STN", city: "London", name: "Stansted", country: "United Kingdom" },
  { code: "LTN", city: "London", name: "Luton", country: "United Kingdom" },
  { code: "LCY", city: "London", name: "London City", country: "United Kingdom" },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom" },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom" },
  { code: "BHX", city: "Birmingham", name: "Birmingham Airport", country: "United Kingdom" },
  { code: "GLA", city: "Glasgow", name: "Glasgow Airport", country: "United Kingdom" },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "ORY", city: "Paris", name: "Orly", country: "France" },
  { code: "NCE", city: "Nice", name: "Cote d'Azur", country: "France" },
  { code: "LYS", city: "Lyon", name: "Lyon-Saint Exupery", country: "France" },
  { code: "MRS", city: "Marseille", name: "Marseille Provence", country: "France" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany" },
  { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany" },
  { code: "DUS", city: "Dusseldorf", name: "Dusseldorf Airport", country: "Germany" },
  { code: "HAM", city: "Hamburg", name: "Hamburg Airport", country: "Germany" },
  { code: "CGN", city: "Cologne", name: "Cologne Bonn", country: "Germany" },
  { code: "STR", city: "Stuttgart", name: "Stuttgart Airport", country: "Germany" },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
  { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland" },
  { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria" },
  { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium" },
  { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark" },
  { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway" },
  { code: "ARN", city: "Stockholm", name: "Arlanda", country: "Sweden" },
  { code: "HEL", city: "Helsinki", name: "Helsinki-Vantaa", country: "Finland" },
  { code: "KEF", city: "Reykjavik", name: "Keflavik International", country: "Iceland" },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy" },
  { code: "MXP", city: "Milan", name: "Malpensa", country: "Italy" },
  { code: "LIN", city: "Milan", name: "Linate", country: "Italy" },
  { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy" },
  { code: "NAP", city: "Naples", name: "Naples International", country: "Italy" },
  { code: "BCN", city: "Barcelona", name: "El Prat", country: "Spain" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain" },
  { code: "AGP", city: "Malaga", name: "Malaga-Costa del Sol", country: "Spain" },
  { code: "PMI", city: "Palma", name: "Palma de Mallorca", country: "Spain" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal" },
  { code: "OPO", city: "Porto", name: "Francisco Sa Carneiro", country: "Portugal" },
  { code: "ATH", city: "Athens", name: "Eleftherios Venizelos", country: "Greece" },
  { code: "SKG", city: "Thessaloniki", name: "Makedonia Airport", country: "Greece" },
  { code: "WAW", city: "Warsaw", name: "Chopin Airport", country: "Poland" },
  { code: "PRG", city: "Prague", name: "Vaclav Havel", country: "Czechia" },
  { code: "BUD", city: "Budapest", name: "Ferenc Liszt International", country: "Hungary" },
  { code: "OTP", city: "Bucharest", name: "Henri Coanda", country: "Romania" },
  { code: "SOF", city: "Sofia", name: "Sofia Airport", country: "Bulgaria" },
  { code: "BEG", city: "Belgrade", name: "Nikola Tesla", country: "Serbia" },
  { code: "ZAG", city: "Zagreb", name: "Franjo Tudman", country: "Croatia" },
  { code: "SVO", city: "Moscow", name: "Sheremetyevo", country: "Russia" },
  { code: "DME", city: "Moscow", name: "Domodedovo", country: "Russia" },
  { code: "LED", city: "Saint Petersburg", name: "Pulkovo", country: "Russia" },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International", country: "India" },
  { code: "GOI", city: "Goa", name: "Dabolim Airport", country: "India" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel", country: "India" },
  { code: "KHI", city: "Karachi", name: "Jinnah International", country: "Pakistan" },
  { code: "LHE", city: "Lahore", name: "Allama Iqbal International", country: "Pakistan" },
  { code: "ISB", city: "Islamabad", name: "Islamabad International", country: "Pakistan" },
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal International", country: "Bangladesh" },
  { code: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka" },
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal" },
  { code: "MLE", city: "Male", name: "Velana International", country: "Maldives" },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "DMK", city: "Bangkok", name: "Don Mueang", country: "Thailand" },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
  { code: "CNX", city: "Chiang Mai", name: "Chiang Mai International", country: "Thailand" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
  { code: "PEN", city: "Penang", name: "Penang International", country: "Malaysia" },
  { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta", country: "Indonesia" },
  { code: "DPS", city: "Denpasar", name: "Ngurah Rai Bali", country: "Indonesia" },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines" },
  { code: "CEB", city: "Cebu", name: "Mactan-Cebu International", country: "Philippines" },
  { code: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat", country: "Vietnam" },
  { code: "HAN", city: "Hanoi", name: "Noi Bai International", country: "Vietnam" },
  { code: "PNH", city: "Phnom Penh", name: "Phnom Penh International", country: "Cambodia" },
  { code: "RGN", city: "Yangon", name: "Yangon International", country: "Myanmar" },
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan" },
  { code: "ITM", city: "Osaka", name: "Itami", country: "Japan" },
  { code: "NGO", city: "Nagoya", name: "Chubu Centrair", country: "Japan" },
  { code: "FUK", city: "Fukuoka", name: "Fukuoka Airport", country: "Japan" },
  { code: "CTS", city: "Sapporo", name: "New Chitose", country: "Japan" },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { code: "GMP", city: "Seoul", name: "Gimpo International", country: "South Korea" },
  { code: "PEK", city: "Beijing", name: "Beijing Capital", country: "China" },
  { code: "PKX", city: "Beijing", name: "Beijing Daxing", country: "China" },
  { code: "PVG", city: "Shanghai", name: "Pudong International", country: "China" },
  { code: "SHA", city: "Shanghai", name: "Hongqiao International", country: "China" },
  { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China" },
  { code: "SZX", city: "Shenzhen", name: "Bao'an International", country: "China" },
  { code: "CTU", city: "Chengdu", name: "Shuangliu International", country: "China" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
  { code: "MFM", city: "Macau", name: "Macau International", country: "Macau" },
  { code: "TPE", city: "Taipei", name: "Taoyuan International", country: "Taiwan" },
  { code: "TSA", city: "Taipei", name: "Songshan", country: "Taiwan" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "MEL", city: "Melbourne", name: "Tullamarine", country: "Australia" },
  { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia" },
  { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia" },
  { code: "ADL", city: "Adelaide", name: "Adelaide Airport", country: "Australia" },
  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
  { code: "WLG", city: "Wellington", name: "Wellington Airport", country: "New Zealand" },
  { code: "CHC", city: "Christchurch", name: "Christchurch Airport", country: "New Zealand" },
  { code: "NAN", city: "Nadi", name: "Nadi International", country: "Fiji" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States" },
  { code: "LGA", city: "New York", name: "LaGuardia", country: "United States" },
  { code: "BOS", city: "Boston", name: "Logan International", country: "United States" },
  { code: "PHL", city: "Philadelphia", name: "Philadelphia International", country: "United States" },
  { code: "IAD", city: "Washington", name: "Dulles International", country: "United States" },
  { code: "DCA", city: "Washington", name: "Ronald Reagan National", country: "United States" },
  { code: "BWI", city: "Baltimore", name: "Baltimore/Washington International", country: "United States" },
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson", country: "United States" },
  { code: "MIA", city: "Miami", name: "Miami International", country: "United States" },
  { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood", country: "United States" },
  { code: "MCO", city: "Orlando", name: "Orlando International", country: "United States" },
  { code: "TPA", city: "Tampa", name: "Tampa International", country: "United States" },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States" },
  { code: "MDW", city: "Chicago", name: "Midway International", country: "United States" },
  { code: "DFW", city: "Dallas", name: "Dallas/Fort Worth International", country: "United States" },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States" },
  { code: "DEN", city: "Denver", name: "Denver International", country: "United States" },
  { code: "PHX", city: "Phoenix", name: "Sky Harbor International", country: "United States" },
  { code: "LAS", city: "Las Vegas", name: "Harry Reid International", country: "United States" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { code: "SAN", city: "San Diego", name: "San Diego International", country: "United States" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { code: "SJC", city: "San Jose", name: "Norman Y. Mineta", country: "United States" },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States" },
  { code: "PDX", city: "Portland", name: "Portland International", country: "United States" },
  { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul", country: "United States" },
  { code: "DTW", city: "Detroit", name: "Detroit Metropolitan", country: "United States" },
  { code: "CLT", city: "Charlotte", name: "Charlotte Douglas", country: "United States" },
  { code: "SLC", city: "Salt Lake City", name: "Salt Lake City International", country: "United States" },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States" },
  { code: "ANC", city: "Anchorage", name: "Ted Stevens Anchorage", country: "United States" },
  { code: "YYZ", city: "Toronto", name: "Pearson International", country: "Canada" },
  { code: "YUL", city: "Montreal", name: "Pierre Elliott Trudeau", country: "Canada" },
  { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada" },
  { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada" },
  { code: "MEX", city: "Mexico City", name: "Benito Juarez International", country: "Mexico" },
  { code: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico" },
  { code: "GDL", city: "Guadalajara", name: "Miguel Hidalgo y Costilla", country: "Mexico" },
  { code: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama" },
  { code: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia" },
  { code: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru" },
  { code: "SCL", city: "Santiago", name: "Arturo Merino Benitez", country: "Chile" },
  { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini Ezeiza", country: "Argentina" },
  { code: "GRU", city: "Sao Paulo", name: "Guarulhos International", country: "Brazil" },
  { code: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil" },
  { code: "BSB", city: "Brasilia", name: "Presidente Juscelino Kubitschek", country: "Brazil" },
  { code: "UIO", city: "Quito", name: "Mariscal Sucre", country: "Ecuador" },
  { code: "HAV", city: "Havana", name: "Jose Marti International", country: "Cuba" },
  { code: "SJU", city: "San Juan", name: "Luis Munoz Marin", country: "Puerto Rico" },
  { code: "NAS", city: "Nassau", name: "Lynden Pindling International", country: "Bahamas" },
];

export function airportLabel(airport: Airport) {
  return `${airport.city} (${airport.code}) · ${airport.name}`;
}

export function airportShortLabel(airport: Airport) {
  return `${airport.city} ${airport.code}`;
}

function normalize(value: string) {
  return value.trim().toUpperCase().replace(/[().·,/-]+/g, " ").replace(/\s+/g, " ");
}

const STOP_WORDS = new Set(["CITY", "AIRPORT", "INTERNATIONAL", "INTL", "THE"]);

function meaningfulTokens(query: string) {
  return query.split(" ").filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function scoreAirport(airport: Airport, query: string, tokens: string[]) {
  const code = airport.code;
  const city = normalize(airport.city);
  const name = normalize(airport.name);
  const country = normalize(airport.country);
  const haystack = `${city} ${code} ${name} ${country}`;
  if (code === query || tokens.includes(code)) return 100;
  if (city === query || name === query) return 90;
  if (code.startsWith(query) && query.length === 3) return 80;
  if (city.startsWith(query) || name.startsWith(query)) return 70;
  if (tokens.some((token) => token.length >= 3 && (city.startsWith(token) || name.startsWith(token)))) {
    return 60;
  }
  if (tokens.some((token) => token.length >= 3 && haystack.includes(token))) return 45;
  if (query.length >= 4 && haystack.includes(query)) return 40;
  return 0;
}

function customAirport(value: string, codeToken?: string): Airport {
  const city = value.trim();
  const code =
    codeToken ||
    city.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  return {
    code,
    city: city || code,
    name: codeToken ? `${code} Airport` : city,
    country: "",
  };
}

export function findAirport(value: string): Airport | null {
  const query = normalize(value);
  if (!query) return null;
  const tokens = meaningfulTokens(query);
  const ranked = AIRPORTS.map((airport) => ({
    airport,
    score: scoreAirport(airport, query, tokens),
  }))
    .filter((item) => item.score >= 60)
    .sort((a, b) => b.score - a.score);
  if (ranked[0]) return ranked[0].airport;

  const codeToken = query.split(" ").find((token) => /^[A-Z]{3}$/.test(token));
  return customAirport(value, codeToken);
}

export function searchAirports(value: string, limit = 8) {
  const query = normalize(value);
  if (!query) {
    return AIRPORTS.filter((airport) =>
      ["DOH", "DXB", "LHR", "JFK", "CDG", "IST", "NBO", "SIN"].includes(airport.code),
    );
  }

  return AIRPORTS.map((airport) => ({
    airport,
    score: scoreAirport(airport, query, meaningfulTokens(query)),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city))
    .slice(0, limit)
    .map((item) => item.airport);
}
