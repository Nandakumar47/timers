declare module 'react-native-push-notification' {
  interface NotificationOptions {
    channelId?: string;
    title: string;
    message: string;
    playSound?: boolean;
    soundName?: string;
    importance?: number;
    vibrate?: boolean;
  }

  interface ConfigureOptions {
    onNotification: (notification: any) => void;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  interface ChannelOptions {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    soundName?: string;
    importance?: number;
    vibrate?: boolean;
  }

  class PushNotification {
    static configure(options: ConfigureOptions): void;

    static createChannel(
      channelConfig: ChannelOptions,
      callback?: (created: boolean) => void,
    ): void;

    static localNotification(options: NotificationOptions): void;

    static scheduleLocalNotification(
      options: NotificationOptions & {date: Date},
    ): void;

    static cancelAllLocalNotifications(): void;

    static cancelLocalNotifications(details: {id?: string}): void;
  }

  export default PushNotification;
}
