import {
    Box,
    Button,
    Container,
    Flex,
    Image,
    Indicator,
    Kbd,
    SegmentedControl,
    Switch,
    Text,
    Title,
    Transition,
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useMove } from '@mantine/hooks';

import { radarData } from '../App';
import { HandleNuiMessage } from '../../nui/HandleNuiMessage';

import classes from './Radar.module.scss';

interface Props {
    canMove: boolean;
    radarData: radarData;
    displayRadar: boolean;
    setDisplayRadar: (boolean) => void;
}

interface BlockData {
    side: 'front' | 'back';
    blocked: boolean;
}

export const Radar: FC<Props> = ({
    canMove,
    radarData,
    setDisplayRadar,
    displayRadar,
}) => {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem('radarPosition');
        return stored ? JSON.parse(stored) : { x: 0.83, y: 0.7 };
    });

    const [speedUnit, setSpeedUnit] = useState<string>(() => {
        const stored = localStorage.getItem('speedUnit');
        return stored || 'mph';
    });

    const { ref } = useMove(({ x, y }) => {
        if (canMove && canMoveObject) {
            setValue({ x, y });
        }
    });

    const [frontBlock, setFrontBlock] = useState<boolean>(false);
    const [backBlock, setBackBlock] = useState<boolean>(false);
    const [canMoveObject, setCanMoveObject] = useState<boolean>(false);

    const handleResetPosition = () => {
        const defaultPosition = { x: 0.83, y: 0.7 };
        setValue(defaultPosition);
        localStorage.setItem('radarPosition', JSON.stringify(defaultPosition));
    };

    useEffect(() => {
        localStorage.setItem('radarPosition', JSON.stringify(value));
    }, [value]);

    useEffect(() => {
        localStorage.setItem('speedUnit', speedUnit);
    }, [speedUnit]);

    HandleNuiMessage('blockRadar', (data: BlockData) => {
        if (data.side === 'front') {
            setFrontBlock(data.blocked);
        } else {
            setBackBlock(data.blocked);
        }
    });

    const speed = (value: number) => {
        if (speedUnit === 'mph') {
            return Math.round(value * 2.23694);
        } else {
            return Math.round(value * 3.6);
        }
    };

    return (
        <Container ref={ref} p={'lg'} fluid className={classes.radarContainer}>
            <Box
                onMouseOver={() => {
                    if (canMove) {
                        setCanMoveObject(true);
                        document.body.style.cursor = 'move';
                    }
                }}
                onMouseLeave={() => {
                    setCanMoveObject(false);
                    document.body.style.cursor = 'default';
                }}
                style={{
                    left: `calc(${value.x * 100}% - 1vw)`,
                    top: `calc(${value.y * 100}% - 1vh)`,
                }}
                p='md'
                className={classes.radar}
            >
                <Indicator color={frontBlock ? 'red' : 'green'}>
                    <Flex
                        direction='column'
                        align='center'
                        justify='center'
                        className={classes.group}
                        bg='dark.7'
                        p='xs'
                    >
                        <Text c='gray.4' fz={15} fw={300} mb={5}>
                            Front Radar
                        </Text>
                        <Container className={classes.plateContainer}>
                            <Image src='plate.png'></Image>
                            <Text className={classes.plate}>
                                {radarData.front?.plate}
                            </Text>
                        </Container>

                        <Title c='gray.1' fz={15} fw={400} mt={10}>
                            {radarData.front?.speed
                                ? speed(radarData.front.speed)
                                : 0}{' '}
                            {speedUnit}
                        </Title>
                    </Flex>
                </Indicator>

                <Indicator color={backBlock ? 'red' : 'green'}>
                    <Flex
                        direction='column'
                        align='center'
                        justify='center'
                        className={classes.group}
                        bg='dark.7'
                        p='xs'
                    >
                        <Text c='gray.4' fz={15} fw={300} mb={5}>
                            Back Radar
                        </Text>
                        <Container className={classes.plateContainer}>
                            <Image src='plate.png'></Image>
                            <Text className={classes.plate}>
                                {radarData.back?.plate}
                            </Text>
                        </Container>
                        <Title c='gray.1' fz={15} fw={400} mt={10}>
                            {radarData.back?.speed
                                ? speed(radarData.back.speed)
                                : 0}{' '}
                            {speedUnit}
                        </Title>
                    </Flex>
                </Indicator>
            </Box>

            <Transition
                mounted={canMove}
                transition='fade'
                duration={400}
                timingFunction='ease'
            >
                {(styles) => (
                    <div style={styles}>
                        <Box p='md' className={classes.infoBox}>
                            <Kbd>ESC</Kbd>
                            <Text c='gray.4' fz={15} fw={400}>
                                Exit moving state
                            </Text>
                        </Box>
                        <Box p='md' className={classes.configBox}>
                            <Switch
                                fz={15}
                                defaultChecked
                                color='blue'
                                checked={displayRadar}
                                onChange={(event) =>
                                    setDisplayRadar(event.currentTarget.checked)
                                }
                                label={
                                    <Text c='gray.4' fz={15} fw={400}>
                                        Display police radar
                                    </Text>
                                }
                            />
                            <SegmentedControl
                                w='100%'
                                color='blue'
                                radius='sm'
                                value={speedUnit}
                                onChange={setSpeedUnit}
                                data={[
                                    { label: 'mph', value: 'mph' },
                                    { label: 'km/h', value: 'km/h' },
                                ]}
                            />
                            <Button
                                variant='light'
                                fullWidth
                                color='red'
                                onClick={handleResetPosition}
                            >
                                Reset Position
                            </Button>
                        </Box>
                    </div>
                )}
            </Transition>
        </Container>
    );
};

export default Radar;
