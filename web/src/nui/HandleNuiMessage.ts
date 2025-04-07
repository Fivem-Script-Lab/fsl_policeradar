import { useRef, useEffect } from 'react';
import { NoOperationFunction } from '../tools/misc';

interface MessageData<T = unknown> {
  action: string,
  data: T
};

type HandlerSignature<T> = (data: T) => void;

export const HandleNuiMessage = <T = unknown>(action: string, handler: (data: T) => void) => {
  const savedHandler = useRef<HandlerSignature<T>>(NoOperationFunction);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const messageListener = (message: MessageEvent<MessageData<T>>) => {
      const { action: messageAction, data } = message.data;
      if (savedHandler.current) {
        if (messageAction === action) {
          savedHandler.current(data);
        };
      };
    };
    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  }, [action]);
};