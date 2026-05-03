export async function fetchLinkedInProfile(url: string) {
  const response = await fetch(
    `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Proxycurl error: " + response.status)
  }

  return response.json()
}
