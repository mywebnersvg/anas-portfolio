export interface StateOption {
  name: string;
  timezone: string;
}

export interface CountryOption {
  name: string;
  code: string;
  timezone: string;
  states?: StateOption[];
}

/** Owner availability — adjust to your real schedule */
export const OWNER_TIMEZONE = "Asia/Karachi";
export const OWNER_WORK_START = 9; // 9 AM
export const OWNER_WORK_END = 19; // 7 PM
export const SLOT_INTERVAL_MINUTES = 30;
export const MIN_NOTICE_MINUTES = 30;

export const MEETING_COUNTRIES: CountryOption[] = [
  {
    name: "Pakistan",
    code: "PK",
    timezone: "Asia/Karachi",
    states: [
      { name: "Punjab", timezone: "Asia/Karachi" },
      { name: "Sindh", timezone: "Asia/Karachi" },
      { name: "KPK", timezone: "Asia/Karachi" },
      { name: "Balochistan", timezone: "Asia/Karachi" },
      { name: "Islamabad", timezone: "Asia/Karachi" },
    ],
  },
  {
    name: "United States",
    code: "US",
    timezone: "America/New_York",
    states: [
      { name: "California", timezone: "America/Los_Angeles" },
      { name: "Texas", timezone: "America/Chicago" },
      { name: "New York", timezone: "America/New_York" },
      { name: "Florida", timezone: "America/New_York" },
      { name: "Illinois", timezone: "America/Chicago" },
      { name: "Washington", timezone: "America/Los_Angeles" },
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    timezone: "Europe/London",
    states: [
      { name: "England", timezone: "Europe/London" },
      { name: "Scotland", timezone: "Europe/London" },
      { name: "Wales", timezone: "Europe/London" },
    ],
  },
  {
    name: "Germany",
    code: "DE",
    timezone: "Europe/Berlin",
    states: [
      { name: "Berlin", timezone: "Europe/Berlin" },
      { name: "Bavaria", timezone: "Europe/Berlin" },
      { name: "Hamburg", timezone: "Europe/Berlin" },
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    timezone: "Asia/Dubai",
    states: [{ name: "Dubai", timezone: "Asia/Dubai" }],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    timezone: "Asia/Riyadh",
    states: [{ name: "Riyadh", timezone: "Asia/Riyadh" }],
  },
  {
    name: "India",
    code: "IN",
    timezone: "Asia/Kolkata",
    states: [
      { name: "Maharashtra", timezone: "Asia/Kolkata" },
      { name: "Delhi", timezone: "Asia/Kolkata" },
      { name: "Karnataka", timezone: "Asia/Kolkata" },
    ],
  },
  {
    name: "Canada",
    code: "CA",
    timezone: "America/Toronto",
    states: [
      { name: "Ontario", timezone: "America/Toronto" },
      { name: "British Columbia", timezone: "America/Vancouver" },
      { name: "Alberta", timezone: "America/Edmonton" },
    ],
  },
  {
    name: "Australia",
    code: "AU",
    timezone: "Australia/Sydney",
    states: [
      { name: "New South Wales", timezone: "Australia/Sydney" },
      { name: "Victoria", timezone: "Australia/Melbourne" },
      { name: "Queensland", timezone: "Australia/Brisbane" },
    ],
  },
];

export function getTimezoneForLocation(
  countryCode: string,
  stateName: string
): string | null {
  const country = MEETING_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return null;

  if (country.states?.length) {
    const state = country.states.find((s) => s.name === stateName);
    return state?.timezone ?? country.timezone;
  }

  return country.timezone;
}
