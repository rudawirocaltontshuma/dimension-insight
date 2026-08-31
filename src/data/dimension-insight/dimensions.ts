/** Shared fictional dimensions used across every DIMENSION INSIGHT module. */

export interface RegionDefinition {
  id: string;
  name: string;
  share: number;
  countries: { id: string; name: string; share: number }[];
}

export const REGIONS: RegionDefinition[] = [
  {
    id: "north-america",
    name: "North America",
    share: 0.34,
    countries: [
      { id: "us", name: "United States", share: 0.68 },
      { id: "ca", name: "Canada", share: 0.21 },
      { id: "mx", name: "Mexico", share: 0.11 },
    ],
  },
  {
    id: "europe",
    name: "Europe",
    share: 0.27,
    countries: [
      { id: "de", name: "Germany", share: 0.31 },
      { id: "uk", name: "United Kingdom", share: 0.28 },
      { id: "fr", name: "France", share: 0.22 },
      { id: "nl", name: "Netherlands", share: 0.19 },
    ],
  },
  {
    id: "apac",
    name: "Asia Pacific",
    share: 0.21,
    countries: [
      { id: "jp", name: "Japan", share: 0.34 },
      { id: "sg", name: "Singapore", share: 0.24 },
      { id: "au", name: "Australia", share: 0.23 },
      { id: "in", name: "India", share: 0.19 },
    ],
  },
  {
    id: "latam",
    name: "Latin America",
    share: 0.11,
    countries: [
      { id: "br", name: "Brazil", share: 0.46 },
      { id: "ar", name: "Argentina", share: 0.29 },
      { id: "cl", name: "Chile", share: 0.25 },
    ],
  },
  {
    id: "mea",
    name: "Middle East & Africa",
    share: 0.07,
    countries: [
      { id: "ae", name: "United Arab Emirates", share: 0.41 },
      { id: "za", name: "South Africa", share: 0.33 },
      { id: "sa", name: "Saudi Arabia", share: 0.26 },
    ],
  },
];

export const PRODUCT_CATEGORIES = [
  "Analytics Suite",
  "Data Platform",
  "Automation Cloud",
  "Security Layer",
  "Integration Hub",
  "Professional Services",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Engineering",
  "Finance",
  "Operations",
  "Customer Success",
  "People",
  "Data & Analytics",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const CUSTOMER_SEGMENTS = ["Enterprise", "Mid-Market", "Growth", "Startup", "Public Sector"] as const;
export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];

export const INDUSTRIES = [
  "Manufacturing",
  "Financial Services",
  "Healthcare",
  "Retail",
  "Logistics",
  "Energy",
  "Telecommunications",
  "Education",
] as const;

export const MARKETING_CHANNELS = [
  "Paid Search",
  "Organic Search",
  "Partner Network",
  "Field Events",
  "Email Lifecycle",
  "Social",
  "Webinars",
] as const;

export type MarketingChannel = (typeof MARKETING_CHANNELS)[number];

export const EXPENSE_CATEGORIES = [
  "Payroll",
  "Cloud Infrastructure",
  "Marketing Programs",
  "Software Licenses",
  "Facilities",
  "Travel",
  "Professional Fees",
  "Equipment",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const COMPANY_PREFIXES = [
  "Arclight",
  "Northwind",
  "Vantage",
  "Beacon",
  "Halcyon",
  "Kestrel",
  "Lumen",
  "Meridian",
  "Solstice",
  "Ironwood",
  "Cobalt",
  "Everline",
  "Granite",
  "Harbourview",
  "Juniper",
  "Larkfield",
  "Nimbus",
  "Orchard",
  "Pinnacle",
  "Quarry",
  "Redstone",
  "Silverbrook",
  "Tidewater",
  "Umbra",
  "Verdant",
  "Westmark",
  "Yarrow",
  "Zenith",
  "Ashford",
  "Bramble",
];

export const COMPANY_SUFFIXES = [
  "Industries",
  "Systems",
  "Group",
  "Holdings",
  "Labs",
  "Networks",
  "Partners",
  "Dynamics",
  "Logistics",
  "Technologies",
];

export const FIRST_NAMES = [
  "Amara",
  "Bastien",
  "Clara",
  "Dario",
  "Elena",
  "Farouk",
  "Greta",
  "Hugo",
  "Ines",
  "Jonas",
  "Keiko",
  "Lucas",
  "Mira",
  "Noel",
  "Olga",
  "Priya",
  "Quentin",
  "Rosa",
  "Soren",
  "Tomas",
  "Ulla",
  "Viktor",
  "Wren",
  "Xenia",
  "Yusuf",
  "Zara",
  "Anton",
  "Brigit",
  "Caleb",
  "Dalia",
];

export const LAST_NAMES = [
  "Alvarez",
  "Brenner",
  "Castellan",
  "Dumont",
  "Eriksen",
  "Ferraro",
  "Grimaldi",
  "Halvorsen",
  "Ivanova",
  "Jansen",
  "Koval",
  "Lindqvist",
  "Moretti",
  "Nakamura",
  "Osei",
  "Petrov",
  "Quintero",
  "Rasmussen",
  "Sandoval",
  "Thorne",
  "Ueda",
  "Vasquez",
  "Whitfield",
  "Xu",
  "Yilmaz",
  "Zieliński",
  "Bergstrom",
  "Contreras",
  "Delacroix",
  "Engel",
];
