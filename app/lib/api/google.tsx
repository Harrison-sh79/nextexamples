import { google } from "googleapis";
/* youtube API key */
const apikey = process.env.YOUTUBE_API_KEY;
/* oauth2 客户端 */
export const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);
/* 创建youtube */
const youtube = google.youtube({
  version: "v3",
  auth: apikey,
});

// 获取channel信息
export function getChannel(tokenInfo: any) {
  oauth2Client.setCredentials(tokenInfo);
  return youtube.channels.list({
    auth: oauth2Client,
    part: ["snippet", "statistics"],
    mine: true,
  });
}
