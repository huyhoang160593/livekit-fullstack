'use client';

import '@livekit/components-styles';
import ky from 'ky';
import CustomEventKey from '../constants/CustomEventKey';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { BiShare } from './svg/BiShare';
import { useCopyToClipboard } from 'usehooks-ts';
import { Notification } from '../components/Notification';

export default function RoomPage() {
  const searchParams = useSearchParams();
  const roomParam = useMemo(() => searchParams.get('room'), [searchParams]);
  const usernameParam = useMemo(
    () => searchParams.get('username'),
    [searchParams]
  );

  const [token, setToken] = useState('');
  const [_value, copy] = useCopyToClipboard();

  const generateToken = useCallback(
    async (/** @type {string} */ room, /** @type {string} */ username) => {
      try {
        const apiParams = new URLSearchParams({
          room,
          username,
        });
        /** @type {GetLKTokenResponseResult} */
        const response = await ky
          .get(`/api/get_lk_token?${apiParams.toString()}`)
          .json();
        setToken(response.token);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );
  const onShareClickHandle = useCallback(
    (/** @type {React.MouseEvent<HTMLButtonElement, MouseEvent>} */ event) => {
      event.preventDefault();
      if (!roomParam) return;
      copy(roomParam);
      const detailObject = /** @type {NotificationObject} */ ({
        type: 'success',
        message: `copy room id ${roomParam} succeeded`,
      });
      window.dispatchEvent(
        new CustomEvent(CustomEventKey.NEW_NOTIFICATION, {
          detail: detailObject,
        })
      );
    },
    [copy, roomParam]
  );
  useEffect(() => {
    if (!roomParam || !usernameParam) return;
    generateToken(roomParam, usernameParam);
  }, [generateToken, roomParam, usernameParam]);

  if (token === '') {
    return (
      <main className="w-screen h-screen flex flex-col justify-center items-center">
        <span className="loading loading-ring loading-lg"></span>
        <span className="text-warning">
          {!Boolean(roomParam) && "'room' params is not defined"}
        </span>
        <span className="text-warning">
          {!Boolean(usernameParam) && "'username' params is not defined"}
        </span>
      </main>
    );
  }

  return (
    <main data-lk-theme="default" className="w-screen h-screen">
      <LiveKitRoom
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={true}
        audio={true}
      >
        <VideoConference />
      </LiveKitRoom>
      <button
        onClick={onShareClickHandle}
        className="btn btn-circle btn-outline fixed right-7 top-7"
      >
        <BiShare />
      </button>
    </main>
  );
}

/** @typedef {import("@/schemas/room").GetLKTokenResponseResult} GetLKTokenResponseResult */
/** @typedef {import('../components/Notification').NotificationObject} NotificationObject */
