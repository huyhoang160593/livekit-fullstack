import { ServerSchema, RoomParamsSchema, GetLKTokenResponse } from '@/schemas/room';
import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server'

export async function GET(/** @type {Request} */ request) {
  // Validate server environment
  const parseServerResult = ServerSchema.safeParse({
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET,
    wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL
  });

  // Validate params of the request
  if (!parseServerResult.success) {
    return NextResponse.json(parseServerResult.error.format(), {
      status: 500,
    });
  }
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const parseRoomResult = RoomParamsSchema.safeParse(params);
  if (!parseRoomResult.success) {
    return NextResponse.json(parseRoomResult.error.format(), {
      status: 400,
    });
  }

  const { apiKey, apiSecret } = parseServerResult.data
  const { room, username } = parseRoomResult.data

  const accessToken = new AccessToken(apiKey, apiSecret, { identity: username })

  accessToken.addGrant({ room: room, roomJoin: true, canPublish: true, canSubscribe: true })

  // Validate Response
  const parseJsonResponseResult = GetLKTokenResponse.safeParse({
    token: accessToken.toJwt()
  })
  if (!parseJsonResponseResult.success) {
    return NextResponse.json(parseJsonResponseResult.error.format(), {
      status: 400,
    });
  }
  return NextResponse.json(parseJsonResponseResult.data)
}
