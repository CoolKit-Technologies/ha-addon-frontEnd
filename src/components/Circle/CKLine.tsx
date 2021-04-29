import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '../../types/interface/IModal';
import { Spin } from 'antd';
import _, { fromPairs } from 'lodash';
interface ICKLine extends IComponentProps {
    days: string[] | undefined;
}
//  折线图接口
interface IHistoryData {
    day: number;
    value: number;
}
const CKLine: React.FC<ICKLine> = (props) => {
    const [allData, setAllData] = useState<Array<IHistoryData>>([]); //折线图的数据
    const [spin, setSpin] = useState(true);
    //  获取历史数据
    async function getHistoryData() {
        setSpin(true);
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                hundredDaysKwh: 'get',
            },
        };
        const res = await updateDeviceByWS(params);
        if (res.error === 0 && res.data.config) {
            // setData(res.data.config.hundredDaysKwhData);
            const data = dealData(res.data.config.hundredDaysKwhData); //获取处理后的数据[{ value:number }]
            console.log(`ML ~ file: CKLine.tsx ~ line 32 ~ getHistoryData ~ data`, data);
            const obj = dealUtils();

            obj.forEach((item, index) => {
                _.assign(item, parseFloat(data[index].value));
            });
            setAllData(obj);
            console.log(`ML ~ file: CKLine.tsx ~ line 35 ~ getHistoryData ~ obj`, obj);
        }
        setSpin(false);
    }
    //  处理历史数据 长度600的16进制字符串
    function dealData(data: string) {
        const arr6: string[] = [];
        for (let i = 0; i <= 99; i++) {
            if (i === 0) {
                arr6.push(data.substr(0, 6));
            } else {
                arr6.push(data.substr(i * 6, 6));
            }
        }
        const dayData = [];
        for (let data of arr6) {
            let target = '';
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    target = parseInt(data.substr(0, 2), 16) + '.';
                } else {
                    target += parseInt(data.substr(i * 2, 2), 16);
                }
            }
            dayData.push(target);
        }
        const historyData = [];
        for (let data of dayData) {
            historyData.push({
                value: data,
            });
        }
        const dayLength = props.days ? props.days : [];
        return _.slice(historyData.reverse(), historyData.length - dayLength.length, historyData.length);
    }
    //  拼接折线数据
    function dealUtils() {
        let days = props.days ? props.days.length : 0;
        let daylist: IHistoryData[] = [];
        for (let i = 1; i <= days; i++) {
            daylist.push({
                value: 0,
                day: i,
            });
        }
        return daylist;
    }
    useEffect(() => {
        console.log('ML ~ file:---------', props.days);
        props.days && getHistoryData();
    }, [props.days]);
    useEffect(() => {
        props.days && getHistoryData();
    }, []);
    const config = {
        width: 300,
        height: 300,
        data: allData,
        xField: 'day',
        yField: 'value',
        xAxis: {
            tickCount: 7,
        },
        yAxis: {
            tickCount: 10,
        },
        tooltip: {
            // customContent: (title, data) => {
            //     return `<div>${title}</div>`;
            // },
            formatter: (datum: any) => {
                // console.log(`ML ~ file: CKLine.tsx ~ line 35 ~ datum`, datum);
                return { name: '功率', value: datum.value + 'kwh' };
            },
            // customContent: (title, data) => {
            //     return `<div>${title}${data}</div>`;
            // },
            // domStyles: {
            //     'g2-tooltip-name': {
            //         display: 'none',
            //     },
            // },
        },
        // yAxis: {
        //     label: {
        //         formatter: function formatter(v: any) {
        //             console.log('v', v);

        //             return `${v}Kwh`;
        //         },
        //     },
        // },
    };
    return (
        <div>
            <Spin spinning={spin}>
                <Line {...config} />
            </Spin>
        </div>
    );
};
export default CKLine;
