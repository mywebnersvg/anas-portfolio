export interface BookMeetingPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  state: string;
  timezone: string;
  meetingUtc: string;
  meetingLabelClient: string;
  meetingLabelOwner: string;
  isCustomTime: boolean;
}

export interface BookMeetingResponse {
  success: boolean;
  message: string;
  meetingId?: string;
}

const API_URL = import.meta.env.VITE_MEETING_API_URL as string | undefined;

export async function bookMeeting(
  payload: BookMeetingPayload
): Promise<BookMeetingResponse> {
  if (!API_URL) {
    console.warn(
      "[BookMeeting] VITE_MEETING_API_URL not set — meeting saved locally only for demo."
    );
    return {
      success: true,
      message:
        "Demo mode: connect your backend API to save meetings, sync Google Sheets, and send emails.",
      meetingId: `demo-${Date.now()}`,
    };
  }

  const response = await fetch(`${API_URL}/api/meetings/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? "Failed to book meeting"
    );
  }

  return response.json() as Promise<BookMeetingResponse>;
}

/** Fetch already-booked slots from your backend (optional) */
export async function fetchBookedSlots(): Promise<string[]> {
  if (!API_URL) return [];

  try {
    const response = await fetch(`${API_URL}/api/meetings/booked`);
    if (!response.ok) return [];
    const data = (await response.json()) as { booked?: string[] };
    return data.booked ?? [];
  } catch {
    return [];
  }
}
