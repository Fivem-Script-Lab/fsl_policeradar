import { FC, useEffect, useState } from 'react';
import Radar from './Radar/Radar';
import { HandleNuiMessage } from '../nui/HandleNuiMessage';
import { TriggerNuiCallback } from '../nui/TriggerNuiCallback';
import { VisibilityProvider } from '../nui/VisibilityProvider';

interface vehicleData {
    speed: number;
    plate: string;
}

export interface radarData {
    front?: vehicleData;
    back?: vehicleData;
}

export const App: FC = () => {
    const [canMove, setCanMove] = useState<boolean>(false);

    const [radarData, setRadarData] = useState<radarData>({});
    const [displayRadar, setDisplayRadar] = useState<boolean>(() => {
        const stored = localStorage.getItem('displayRadar');
        return stored ? JSON.parse(stored) : true;
    });

    HandleNuiMessage('canMove', (data: boolean) => {
        setCanMove(data);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setCanMove(false);
                TriggerNuiCallback('canMove', false);
                window.removeEventListener('keydown', handleKeyDown);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
    });

    HandleNuiMessage('vehicleDataFront', (data: vehicleData) => {
        setRadarData({ ...radarData, front: data });
    });

    HandleNuiMessage('vehicleDataBack', (data: vehicleData) => {
        setRadarData({ ...radarData, back: data });
    });

    useEffect(() => {
        localStorage.setItem('displayRadar', JSON.stringify(displayRadar));
        TriggerNuiCallback('displayRadar', displayRadar);
    }, [displayRadar]);

    useEffect(() => {
        TriggerNuiCallback('displayRadar', displayRadar);
    }, []);

    return (
        <>
            <VisibilityProvider
                component='Radar'
                transitionProps={{
                    transition: 'fade',
                    duration: 400,
                    timingFunction: 'ease-in-out',
                }}
                shouldClose={false}
                alsoVisible={() => canMove}
            >
                <Radar
                    canMove={canMove}
                    radarData={radarData}
                    displayRadar={displayRadar}
                    setDisplayRadar={setDisplayRadar}
                ></Radar>
            </VisibilityProvider>
        </>
    );
};

export default App;
