"use server";
import { google } from "googleapis";
import { cookies } from "next/headers";

export async function getEmails(maxResults: Number) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: cookies().get("google_refresh_token")?.value,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: maxResults,
    q: "-from:me",
  });
  const messagesID = res.data.messages;

  const messages = messagesID.map(async (message) => {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
      format: "full",
    });
    return res.data;
  });

  return messages;
}
