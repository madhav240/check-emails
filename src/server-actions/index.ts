"use server";
import { google } from "googleapis";
import { cookies } from "next/headers";

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

export async function getLastEmailsData(maxResults: number) {
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: maxResults,
    q: "-from:me",
  });

  return res.data.messages || [];
}

export async function getEmailData(id: string) {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: id,
    format: "full",
  });
  return res.data;
}
