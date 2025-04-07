import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { HandleNuiMessage } from '../nui/HandleNuiMessage';
import { IsRunningInBrowser, IsInputFocused } from '../tools/misc';
import { TriggerNuiCallback } from '../nui/TriggerNuiCallback';
import { Transition, MantineTransition } from '@mantine/core';

interface VisibilityProviderValue {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const VisibilityProviderContext = createContext<VisibilityProviderValue | null>(
    null
);

export const VisibilityProvider: FC<{
    children: ReactNode;
    component: string;
    transitionProps: {
        transition: MantineTransition;
        duration: number;
        timingFunction: string;
    };
    shouldClose: boolean;
    alsoVisible?: () => boolean;
}> = ({ children, component, transitionProps, shouldClose, alsoVisible }) => {
    const [visible, setVisible] = useState(false);
    HandleNuiMessage<boolean>(`setVisible${component}`, setVisible);
    const isFocused = IsInputFocused();

    useEffect(() => {
        if (!visible) return;

        const keyHandler = (keyboardEvent: KeyboardEvent) => {
            if (isFocused) return;
            if (!shouldClose) return;

            if (['Backspace', 'Escape'].includes(keyboardEvent.key)) {
                if (!IsRunningInBrowser()) {
                    TriggerNuiCallback('hideComponent', {
                        action: `setVisible${component}`,
                        data: false,
                    });
                } else {
                    setVisible(false);
                }
            }
        };

        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, [visible, component, isFocused]);

    return (
        <VisibilityProviderContext.Provider value={{ visible, setVisible }}>
            <Transition
                mounted={visible || (alsoVisible ? alsoVisible() : false)}
                transition={transitionProps.transition}
                duration={transitionProps.duration}
                timingFunction={transitionProps.timingFunction}
            >
                {(styles) => (
                    <div className='animation-div' style={styles}>
                        {children}
                    </div>
                )}
            </Transition>
        </VisibilityProviderContext.Provider>
    );
};
