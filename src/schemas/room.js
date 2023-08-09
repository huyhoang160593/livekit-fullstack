import { z } from 'zod';

const ServerMisconfigureSchema = z.string({
  required_error: 'Server misconfigured',
});

export const ServerSchema = z.object({
  apiKey: ServerMisconfigureSchema,
  apiSecret: ServerMisconfigureSchema,
  wsUrl: ServerMisconfigureSchema,
});

export const RoomParamsSchema = z.object({
  username: z
    .string({
      required_error: 'Missing "username" parameter',
      invalid_type_error: '"username" parameter must be a string',
    })
    .trim()
    .min(1, 'Missing "username" parameter'),
  room: z
    .string({
      required_error: 'Missing "room" parameter',
      invalid_type_error: '"room" parameter must be a string',
    })
    .trim()
    .transform((value) => {
      if (!value || value?.length === 0) {
        return crypto.randomUUID();
      }
      return value;
    })
    .pipe(z.string().uuid('"room" parameter must be an UUID')),
});

export const GetLKTokenResponse = z.object({
  token: z.string({
    required_error: `'token' has not been passed to response`,
  }),
});
/** @typedef {z.infer<typeof GetLKTokenResponse>} GetLKTokenResponseResult */
