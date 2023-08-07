import { z } from "zod";

const ServerMisconfigureSchema = z.string({
  required_error: 'Server misconfigured',
});

export const ServerSchema = z.object({
  apiKey: ServerMisconfigureSchema,
  apiSecret: ServerMisconfigureSchema,
  wsUrl: ServerMisconfigureSchema,
});

export const RoomParamsSchema = z.object({
  room: z.string({
    required_error: 'Missing "room" query parameter',
  }),
  username: z.string({
    required_error: 'Missing "username" query parameter',
  }),
});


export const GetLKTokenResponse = z.object({
  token: z.string({required_error: `'token' has not been passed to response`})
})
/** @typedef {z.infer<typeof GetLKTokenResponse>} GetLKTokenResponseResult */
