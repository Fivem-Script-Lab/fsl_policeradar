import { IsRunningInBrowser } from "../tools/misc";

interface NuiMessage<T = unknown> {
    action: string,
    data: T
};

export const SendNuiMessage = <P>(messages: NuiMessage<P>[], timeout = 1000): void => {
  if (import.meta.env.DEV && IsRunningInBrowser()) {
    for (const message of messages) {
      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {data: {action: message.action, data: message.data}}));
      }, timeout);
    };
  };
};