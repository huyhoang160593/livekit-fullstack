'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomParamsSchema } from '@/schemas/room';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const {
    Enum: { room, username },
  } = useMemo(() => RoomParamsSchema.keyof(), []);

  /** @type {UseFormReturn<RoomFormFieldValues>} */
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(RoomParamsSchema),
  });

  const roomIDWatch = useWatch({
    control,
    name: room,
  });

  /** @type {SubmitHandler<RoomFormFieldValues>} */
  const onFormSubmit = (data) => {
    const searchParams = new URLSearchParams(data);
    router.push(`/room?${searchParams.toString()}`);
    return;
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="card lg:card-side bg-base-100 shadow-xl"
      >
        <figure>
          <Image
            width={400}
            height={400}
            priority={true}
            src="/card-image.jpg"
            alt="Image of zoom people"
            className="w-[400px] h-[400px]"
          />
        </figure>
        <section className="card-body justify-around">
          <h2 className="card-title">Livekit demo</h2>

          <div>
            <fieldset className="form-control w-full max-w-xs">
              <label htmlFor={username} className="label">
                <span className="label-text">Your username</span>
              </label>
              <input
                id={username}
                type="text"
                placeholder="Choose your username"
                className={clsx('input input-bordered w-full max-w-xs', {
                  ['input-error']: errors.username,
                })}
                {...register(username)}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.username?.message}
                </span>
              </label>
            </fieldset>
            <fieldset className="form-control w-full max-w-xs">
              <label htmlFor={room} className="label">
                <span className="label-text">RoomID to join</span>
              </label>
              <input
                id={room}
                type="text"
                placeholder="Type your RoomID here"
                className={clsx('input input-bordered w-full max-w-xs', {
                  ['input-error']: errors.room,
                })}
                {...register(room)}
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.room?.message}
                </span>
              </label>
            </fieldset>
          </div>
          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              {roomIDWatch?.length > 0 ? 'Join Room' : 'Create Room'}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

/** TYPE_DEFINITIONS */
/**
 * @template {import('react-hook-form').FieldValues} T
 * @typedef {import('react-hook-form').UseFormReturn<T>} UseFormReturn
 * */
/**
 * @template {import('react-hook-form').FieldValues} T
 * @typedef {import('react-hook-form').SubmitHandler<T>} SubmitHandler
 */
/** @typedef {Zod.infer<typeof RoomParamsSchema>} RoomFormFieldValues*/
