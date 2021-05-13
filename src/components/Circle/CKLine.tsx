import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
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
    const { formatMessage } = useIntl();
    const [allData, setAllData] = useState<Array<IHistoryData>>([]); //折线图的数据
    const [spin, setSpin] = useState(true);

    async function getHistoryData(month: number) {
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
            // const datas =
            //     '190101190301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
            const dealdata = dealData(temp, month);
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
            // tempObj.monthSumNum += resultNum;

            // tempObj.month = monthNum;
            result[`${monthNum}`] = tempObj;

            // allMonthSum = allMonthSum + resultNum
        }
        const obj = result[month];
        let data: IHistoryData[] = [];
        data = Object.keys(obj).map((item) => ({
            day: item,
            value: _.get(obj, `${item}`) as number,
        }));
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
            formatter: (datum: any) => {
                return { name: formatMessage({ id: 'device.card.power' }), value: datum.value + 'kWh' };
            },
        },
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
