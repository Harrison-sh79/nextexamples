import { oauth2Client } from "@/app/lib/api/google";

export async function GET(_request: Request) {
  const scopes = [
    // 'https://www.googleapis.com/auth/youtube',  //Manage your YouTube account
    "https://www.googleapis.com/auth/youtube.readonly", //View your YouTube account
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/yt-analytics-monetary.readonly", //View monetary and non-monetary YouTube Analytics reports for your YouTube content
    "https://www.googleapis.com/auth/yt-analytics.readonly", //View YouTube Analytics reports for your YouTube content
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });
  console.log(authorizationUrl);
  return Response.redirect(authorizationUrl, 301);
  //   res.redirect(301, authorizationUrl);
}
