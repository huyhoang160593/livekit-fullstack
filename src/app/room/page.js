'use client';

import ky from 'ky';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import '@livekit/components-styles'

export default function RoomPage() {
  const room = 'quickstart-room';
  const name = 'quickstart-user';

  const [token, setToken] = useState('');
  async function generateToken() {
    try {
      const apiParams = new URLSearchParams({
        room,
        username: name
      })
      /** @type {import("@/schemas/room").GetLKTokenResponseResult} */
      const response = await ky
        .get(`/api/get_lk_token?${apiParams.toString()}`)
        .json();
      setToken(response.token);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    generateToken();
  }, []);

  if (token === '') {
    return <div>Getting token...</div>;
  }
  return (
    <div data-lk-theme="default">
      <LiveKitRoom
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={true}
        audio={true}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
