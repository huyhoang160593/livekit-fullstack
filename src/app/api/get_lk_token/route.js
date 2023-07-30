import { z } from 'zod';
import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

const ServerMisconfigureSchema = z.string({
  required_error: 'Server misconfigured',
});

const RoomParamsSchema = z.object({
  room: z.string({
    required_error: 'Missing "room" query parameter',
  }),
  username: z.string({
    required_error: 'Missing "username" query parameter',
  }),
});

const ServerSchema = z.object({
  apiKey: ServerMisconfigureSchema,
  apiSecret: ServerMisconfigureSchema,
  wsUrl: ServerMisconfigureSchema,
});

export async function GET(/** @type {Request} */ request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const {
    data: paramsData,
    success: parseRoomParamsSuccess,
    error: parseRoomParamsError,
  } = RoomParamsSchema.safeParse(params);
  if (!parseRoomParamsSuccess) {
    return NextResponse.json(parseRoomParamsError, {
      status: 400,
    });
  }
  const {
    data: serverData,
    success: parseServerSuccess,
    error: parseServerError,
  } = ServerSchema.safeParse({
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET,
    wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL
  });

  if (!parseServerSuccess) {
    return NextResponse.json(parseServerError, {
      status: 500,
    });
  }

  const accessToken = new AccessToken(serverData.apiKey, serverData.apiSecret, { identity: paramsData.username })

  accessToken.addGrant({ room: paramsData.room, roomJoin: true, canPublish: true, canSubscribe: true })

  return NextResponse.json({token: accessToken.toJwt()})
}
