import React from 'react';
import { Link } from 'umi';
import { Button } from 'antd';
import { updateDeviceName, updateChannelName, getDeviceById, updateDeviceByWS, getOtaInfo, upgradeDeviceByWS, controlDiyDevice } from '@/api';

const Settings: React.FC = (props) => {
    console.log(props);

    const handleClick1 = () => {
        updateDeviceName({
            id: '1000bde572',
            newName: 'T2000'
        }).then((res) => {
            console.log(res)
        })
    }

    const handleClick2 = () => {
        updateChannelName({
            id: '1000bde572',
            tags: {1:'Super Fan'}
        })
    }

    const handleClick3 = () => {
        getDeviceById({ id: '1000bde572'}).then((res) => console.log(res))
    }

    const handleClick4 = () => {
        updateDeviceByWS({
            id: '1000bde572',
            apikey: '6a4eea7c-5383-403c-988c-54fd883583ae',
            params: {
                // sledOnline: 'off'
                // "lock":1,"zyx_clear_timers":true
                // "lock":0,"zyx_clear_timers":false

                /*pulses: [
                    {pulse:'on',outlet:0,width:2000}
                ]*/
                // startup:'stay'
                // "configure":[{"startup":"on","outlet":0},{"startup":"off","outlet":1},{"startup":"off","outlet":2},{"startup":"off","outlet":3}]
            }
        }).then((res) => console.log(res))
    }
    const handleClick5 = () => {
        getOtaInfo({list: [{deviceid:'100084baaf',model:'PSA-B01-GL',version:'2.6.1'}] }).then((res) => console.log(res))
    }
    const handleClick6 = () => {
        upgradeDeviceByWS({
            id: '100084baaf',
            apikey: '6a4eea7c-5383-403c-988c-54fd883583ae',
            params: {
                model: 'PSA-B01-GL',
                version: '3.5.0',
                
	"binList": [
		{
			"name": "user1.bin",
			"downloadUrl": "http://8.136.108.245:8088/ota/rom/Q17o1RvvMavteX7N9CoZ0pKtePDf5YZS/user1.1024.new.2.bin",
			"digest": "240ff1388e2631f3df9761119b48dbb19d63e11ef5acf8f214148ceeb29f75cc"
		},
		{
			"name": "user2.bin",
			"downloadUrl": "http://8.136.108.245:8088/ota/rom/Q17o1RvvMavteX7N9CoZ0pKtePDf5YZS/user2.1024.new.2.bin",
			"digest": "1951a5313fa45c8e5afda9270d0763dbede6112bf4ccd6168125c45f6f12b221"
		}
	]

            }
        }).then((res) => console.log(res))
    }

    const handleClick7 = () => {
        controlDiyDevice({
            /*id: '1000c5c8b1',
            type: 'switch',
            params: {
                state: 'on'
            }*/

            /*id: '1000c5c8b1',
            type: 'pulse',
            params: {
                state: 'on',
                width: 500
            }*/


            id: '1000c5c8b1',
            type: 'pulse',
            params: {
                state: 'off',
            }
        }).then((res) => console.log(res))
    };


    return (
        <>
            <h1>设置测试页面</h1>
            <Button onClick={() => handleClick1()}>Change Name</Button>
            <Button onClick={() => handleClick2()}>Change Channel Name</Button>
            <Button onClick={() => handleClick3()}>get device</Button>
            <Button onClick={() => handleClick4()}>lock</Button>
            <Button onClick={() => handleClick5()}>get ota</Button>
            <Button onClick={() => handleClick6()}>update ota</Button>

            <Button onClick={() => handleClick7()}>diy</Button>
            <Link to="/">==================== Home ===================</Link>
        </>
    );
};

export default Settings;
