import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription
} from '../utils/pushNotifications';

const pushNotificationSupported = isPushNotificationSupported();
const API_URL = process.env.REACT_APP_API_URL;

export default function usePushNotifications() {
  const [userConsent, setUserConsent] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [serverSubscriptionId, setServerSubscriptionId] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMobile) setUserConsent(Notification.permission);
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExistingSubscription();
  }, []);

  const askUserConsent = () => {
    setLoading(true);
    setError(false);
    return askUserPermission().then(consent => {
      setUserConsent(consent);
      if (consent !== 'granted') {
        setError({
          name: 'Consent denied',
          message: 'Push notification consent has been denied.',
          code: 0
        });
      }
      setLoading(false);
    });
  };

  const subscribeToNotifications = () => {
    setLoading(true);
    setError(false);
    return createNotificationSubscription()
      .then(subscription => {
        setUserSubscription(subscription);
        setLoading(false);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Error creating notification subscription:', err);
        setError(err);
        setLoading(false);
      });
  };

  const sendSubscriptionToServer = (userId = '') => {
    setLoading(true);
    setError(false);
    if (!userSubscription) return;
    return fetch(`${API_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      mode: 'cors',
      body: JSON.stringify(userSubscription)
    })
      .then(response => response.json())
      .then(data => {
        setServerSubscriptionId(data.id);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });
  };

  /**
   * Need this extra method to work in a single click for reporting flow. Hooks
   * take multiple cycles to update their internal state so this redundancy is
   * needed for seamless interaction and functionality!
   * @param {string | number} userId - should be a number or number string
   * @returns {Promise<void>}
   */
  const subscribeToNotificationsAndSendToServer = (userId = '') => {
    setLoading(true);
    setError(false);
    return createNotificationSubscription()
      .then(subscription => {
        setUserSubscription(subscription);
        setLoading(false);
        return subscription;
      })
      .then(subscriptionObject => {
        return fetch(`${API_URL}/subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': userId
          },
          mode: 'cors',
          body: JSON.stringify(subscriptionObject)
        });
      })
      .then(response => response.json())
      .then(data => {
        setServerSubscriptionId(data.id);
        setLoading(false);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Error setting up push notification subscription:', err);
        setLoading(false);
        setError(err);
      });
  };

  const requestNotification = async () => {
    setLoading(true);
    setError(false);
    await fetch(`${API_URL}/subscription/${serverSubscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }).catch(err => {
      setLoading(false);
      setError(err);
    });
    setLoading(false);
  };

  return {
    askUserConsent,
    subscribeToNotifications,
    sendSubscriptionToServer,
    subscribeToNotificationsAndSendToServer,
    serverSubscriptionId,
    requestNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading
  };
}
