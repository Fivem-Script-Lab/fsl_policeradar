import { useState, useEffect } from "react";

export const IsRunningInBrowser = (): boolean => !(window as any).invokeNative;


export const NoOperationFunction = () => { };
export const IsInputFocused = () => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const checkFocus = () => {
      const activeEl = document.activeElement as HTMLElement | null;
      setIsFocused(
        !!activeEl && 
        (activeEl.tagName === "INPUT" || 
         activeEl.tagName === "TEXTAREA" || 
         activeEl.tagName === "SELECT" || 
         activeEl.isContentEditable)
      );
    };

    document.addEventListener("focusin", checkFocus);
    document.addEventListener("focusout", checkFocus);

    checkFocus();

    return () => {
      document.removeEventListener("focusin", checkFocus);
      document.removeEventListener("focusout", checkFocus);
    };
  }, []);

  return isFocused;
};


