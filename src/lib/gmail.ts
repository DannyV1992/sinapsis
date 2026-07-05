import { google } from "googleapis";

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
}

export async function sendGmailNotification(subject: string, bodyHtml: string, to = "info@sinapsiscr.com") {
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const message = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    bodyHtml,
  ].join("\n");

  const encoded = Buffer.from(message).toString("base64url");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encoded },
  });
}
