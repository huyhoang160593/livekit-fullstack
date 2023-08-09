'use client';

import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';
import CustomEventKey from '../constants/CustomEventKey';

const TIMEOUT_MS = 5000

export const Notification = () => {
  const [notifications, setNotifications] = useState(
    /** @type {NotificationObject[]} */ ([])
  );
  const currentTimeout = useRef(/** @type {NodeJS.Timeout | null} */(null))

  useEffect(() => {
    function onNewNotificationHandle(/** @type {Event & {detail?: NotificationObject}} */event) {
      if (!event.detail) return
      setNotifications([...notifications, event.detail])
      if(currentTimeout.current !== null) {
        clearTimeout(currentTimeout.current)
      }
      currentTimeout.current = setTimeout(() => {
        setNotifications([])
      }, TIMEOUT_MS)
    }
    window.addEventListener(CustomEventKey.NEW_NOTIFICATION, onNewNotificationHandle)
    return () => {
      window.removeEventListener(CustomEventKey.NEW_NOTIFICATION, onNewNotificationHandle)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="toast">
      {notifications.map((notification, index) => (
        <div
          key={`notification-${index}`}
          className={clsx('alert',
          {
            ['alert-success']: notification.type === 'success',
            ['alert-info']: notification.type === 'info',
            ['alert-warning']: notification.type === 'warning',
            ['alert-error']: notification.type === 'error'
          })}
        >
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * @typedef {{
 *  type: 'info' | 'success' | 'warning' | 'error'
 *  message: string
 * }} NotificationObject
 * */
