import CustomEventKey from '../constants/CustomEventKey';

export function generateNewNotification(
  /** @type {NotificationObject['type']} */ type,
  /** @type {NotificationObject['message']} */ message
) {
  const detail = /** @type {NotificationObject} */ ({
    type,
    message,
  });
  return new CustomEvent(CustomEventKey.NEW_NOTIFICATION, {
    detail,
  });
}

/** @typedef {import('../components/Notification').NotificationObject} NotificationObject */
