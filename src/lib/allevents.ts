const URL = "https://allevents.in/api/index.php/organizer/web/get_events";

export async function getUpcomingEvents() {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizer_id: "25298106",
      past: 0,
      page: 0,
      count: 4,
    }),
  });

  if (!response.ok) {
    throw new Error(`Allevents request failed: ${response.status}`);
  }

  const json = await response.json();

  return json.data;
}
