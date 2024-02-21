import { mysql_db as db } from "@/app/lib/db/mysql";
import { oauth2Client, getChannel } from "@/app/lib/api/google";
import moment from "moment";

export async function GET(request: Request) {
  /* 获取Youtube Query Params， 包括code，scope，error */
  const { searchParams }: { searchParams: any } = new URL(request.url);
  console.log("🚀 ~ file: route.tsx:8 ~ GET ~ searchParams:", searchParams)
  
  /* 授权错误，返回错误信息并退出 */
  if (searchParams.error) {
    console.log("authorization error:", searchParams.error);
    return new Error(searchParams.error);
  }
  //用授权code换取token
  const code = searchParams.get('code')
  let { tokens } = await oauth2Client.getToken(code);
  let tokenInfo: any = tokens;
  console.log("🚀 ~ file: route.tsx:19 ~ GET ~ tokenInfo:", tokenInfo)

  //识别token是哪个channel的，方便入库
  let channelInfoResponse: any = await getChannel(tokenInfo);
  console.log("🚀 ~ file: route.tsx:23 ~ GET ~ channelInfoResponse:", channelInfoResponse)
  
  if (channelInfoResponse.error) {
    console.log(
      "The get Channel list API returned an error: " + channelInfoResponse.error
    );
    return new Error(
      "The get Channel list API returned an error: " + searchParams.error
    );
  }
  var channels = channelInfoResponse.data.items;
  if (channelInfoResponse.data.pageInfo.totalResults < 1) {
    return Response.json({ error: "no channel found!" });
  }
  //todo channel 可能有多个，这里默认取第一个
  let c = channels[0];
  // console.log("channel:",c);

  let channelId = c.id;
  let title = c.snippet.title;
  let customUrl = c.snippet.customUrl;
  let thumbnail = c.snippet.thumbnails.default.url; //size default 88 medium 240 high:800;
  let subscriberCount = c.statistics.subscriberCount;
  let videoCount = c.statistics.videoCount;
  let viewCount = c.statistics.viewCount;

  //查询是否有相同的channelId记录，若存在则更新授权状态及最新数据，不存在则插入
  try {
    //check same record
    const checkQuery = "select * from influencer_youtube where channel_id = ?";
    const checkResult: any = await db.query(checkQuery, [channelId]);
    let message = "";
    // console.log("checkResult:",checkResult);
    // return;
    // let tokenExpiredAt = formatTimestamp(tokenInfo.expiry_date)
    // let tokenExpiredAt = tokenInfo.expiry_date;
    let tokenExpiredAt = moment
      .unix(tokenInfo.expiry_date / 1000)
      .format("YYYY-MM-DD HH:mm:ss");
    console.log("tokenExpiredAt:", tokenExpiredAt);

    if (checkResult.length > 0) {
      //存在，更新
      const updateQuery =
        "update influencer_youtube set title = ?, custom_url=?,thumbnail_url=?,auth_status=?,subscriber_count=?,video_count=?,view_count=?,token=?,scope=?,token_expired_timestamp=?,token_expired_at=? where channel_id = ?";

      const updateValues = [
        title,
        customUrl,
        thumbnail,
        1,
        subscriberCount,
        videoCount,
        viewCount,
        tokenInfo.access_token,
        tokenInfo.scope,
        tokenInfo.expiry_date,
        tokenExpiredAt,
        channelId,
      ];
      await db.query(updateQuery, updateValues);
      message = "update authorize successfully!";
    } else {
      //insert a new record
      const insertQuery =
        "insert into influencer_youtube (channel_id,title,custom_url,thumbnail_url,auth_status,subscriber_count,video_count,view_count,token,scope,token_expired_timestamp,token_expired_at,created_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
      const values = [
        channelId,
        title,
        customUrl,
        thumbnail,
        1,
        subscriberCount,
        videoCount,
        viewCount,
        tokenInfo.access_token,
        tokenInfo.scope,
        tokenInfo.expiry_date,
        tokenExpiredAt,
        created_at,
      ];
      await db.query(insertQuery, values);
      message = "authorization successfully!";
    }
    return Response.json({ message });
  } catch (error) {
    console.error("Error get information:", error);
    // res.status(500).json({ error: "Internal Server Error" });
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
