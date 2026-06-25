import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return new NextResponse(
      `
      <html>
        <head><title>Autorización exitosa</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
          <h1 style="color: #5b7b7a;">Autorización exitosa</h1>
          <p>Copia el siguiente <strong>refresh_token</strong> y pégalo en tu archivo <code>.env.local</code>:</p>
          <pre style="background: #f0f0f0; padding: 16px; border-radius: 8px; word-break: break-all; white-space: pre-wrap;">${tokens.refresh_token}</pre>
          <p>Agrégalo así en <code>.env.local</code>:</p>
          <pre style="background: #f0f0f0; padding: 16px; border-radius: 8px;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
          <p style="color: #666; margin-top: 24px;">Ya puedes cerrar esta pestaña y reiniciar el servidor de desarrollo.</p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.json(
      { error: "Error al obtener tokens" },
      { status: 500 }
    );
  }
}
