import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '../../types/interface/IModal';
import { Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
interface ICKLine extends IComponentProps {
    month: number;
    setConsumed: (consumed: number) => void;
}
//  折线图接口
interface IHistoryData {
    day: string;
    value: number;
}

const CKLine: React.FC<ICKLine> = (props) => {
    const [allData, setAllData] = useState<Array<IHistoryData>>([]); //折线图的数据
    const [spin, setSpin] = useState(true);

    async function getHistoryData(month: number) {
        // console.log(`ML ~ file: CKLine.tsx ~ line 24 ~ getHistoryData ~ month`, month);
        setSpin(true);
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                // hundredDaysKwh: 'get',
            },
        };
        props.uiid !== 126
            ? _.assign(params.params, { hundredDaysKwh: 'get' })
            : props.i === 1
            ? _.assign(params.params, { getKwh_01: 2 })
            : _.assign(params.params, { getKwh_00: 2 });
        const res = await updateDeviceByWS(params);
        // console.log(`ML ~ file: CKLine.tsx ~ line 33 ~ getHistoryData ~ res`, res);
        if (res.error === 0 && res.data.config) {
            // const data = dealData(res.data.config.hundredDaysKwhData, 4);
            let temp = '';
            if (res.data.config.hundredDaysKwhData) {
                temp = res.data.config.hundredDaysKwhData;
            } else if (res.data.config.kwhHistories_00) {
                temp = res.data.config.kwhHistories_00;
            } else if (res.data.config.kwhHistories_01) {
                temp = res.data.config.kwhHistories_01;
            }
            const datas =
                '190101190301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
            const dealdata = dealData(temp, month);
            console.log(`ML ~ file: CKLine.tsx ~ line 102 ~ getHistoryData ~ data`, dealdata);
            dealdata && setAllData(dealdata);
        }
        setSpin(false);
    }
    // 处理历史数据函数
    function dealData(datas: string, month: number) {
        let result: { [key: string]: object } = {};
        for (let i = 0; i < datas.length / 6; i++) {
            //获取到这一天的数值
            const firNumStr = datas.substr(i * 6, 2);
            const secNumStr = datas.substr(i * 6 + 2, 2);
            const thrNumStr = datas.substr(i * 6 + 4, 2);
            const firNum = parseInt(firNumStr, 16);
            const secNum = parseInt(secNumStr, 16);
            const thrNum = parseInt(thrNumStr, 16);
            const resultNumStr = `${firNum}.${secNum}${thrNum}`;
            const resultNum = parseFloat(resultNumStr);

            //获取这一天的时间对象 是今天的第前几天0，1，2，3，4，
            const tempDate = moment().subtract(i, 'days');

            // LogUtil.warn('这一天的时间',tempDate)

            //获取当前是几月，获取月份
            const monthNum = tempDate.get('month') + 1;
            //获取这一天是几号，获取是几号
            const dayNum = tempDate.get('date');

            //获取这一个月有几天,获取这个月有几天
            // const monthDayNum = tempDate.daysInMonth();

            //写入对象中
            let tempObj = result[`${monthNum}`] ? result[`${monthNum}`] : {};

            // tempObj.monthSumNum = tempObj.monthSumNum ? tempObj.monthSumNum : 0;
            // tempObj[`${dayNum}`] = resultNum;
            _.set(tempObj, `${dayNum}`, resultNum);
            // tempObj.dayNum = monthDayNum;
            // LogUtil.info('这一天的时间', firNumStr, secNumStr, thrNumStr)
            // tempObj.monthSumNum += resultNum;

            // tempObj.month = monthNum;
            result[`${monthNum}`] = tempObj;

            // allMonthSum = allMonthSum + resultNum
        }
        // console.log(`ML ~ file: deal.ts ~ line 75 ~ result`, result);
        // console.log(result['4']);
        const obj = result[month];
        // console.log(`ML ~ file: test.js ~ line 48 ~ obj`, obj);
        let data: IHistoryData[] = [];
        data = Object.keys(obj).map((item) => ({
            day: item,
            value: _.get(obj, `${item}`) as number,
        }));
        // console.log(`ML ~ file: test.js ~ line 54 ~ data`, data);
        const temp = data.map((item) => item.value);
        props.setConsumed(temp.reduce((total, item) => total + item));
        return data;
    }
    useEffect(() => {
        props.month && getHistoryData(props.month);
    }, [props.month]);
    useEffect(() => {
        props.month ? getHistoryData(props.month) : getHistoryData(moment().month() + 1);
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
