// DualR3 设备需要显示两个卡片
import React from 'react';
import DualR3Card from '@/components/DeviceCard/DualR3Card';
import { DeviceType } from '@/types/device';

interface DoubleDualR3CardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
        deviceId: string;
        apikey: string;
        model: string;
        fwVersion: string;
    };
    channels: {
        stat: 'on' | 'off';
        name: string;
    }[];
    voltages: string[];
    currents: string[];
    ballData: {
        title: string;
        content: string;
    }[];
}

const DoubleDualR3Card: React.FC<DoubleDualR3CardProps> = ({ deviceData, channels, voltages, currents, ballData }) => {
    return (
        <div>
            <DualR3Card
                deviceData={deviceData}
                channel={channels[0]}
                voltage={voltages[0]}
                current={currents[0]}
                ballData={ballData.slice(0,3)}
                i={0}
            />
            <DualR3Card
                deviceData={deviceData}
                channel={channels[1]}
                voltage={voltages[1]}
                current={currents[1]}
                ballData={ballData.slice(3)}
                i={1}
            />
        </div>
    );
};

export default DoubleDualR3Card;
