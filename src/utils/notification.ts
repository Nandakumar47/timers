import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION RECEIVED:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export const initializeNotificationChannel = (): void => {
  PushNotification.createChannel(
    {
      channelId: 'timer-channel',
      channelName: 'Timer Notifications',
      channelDescription: 'Notifications for halfway and completed timers',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`Notification channel created: ${created}`),
  );
};

export const showNotification = (title: string, message: string): void => {
  console.log(`Showing notification: ${title} - ${message}`);
  PushNotification.localNotification({
    channelId: 'timer-channel',
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};
