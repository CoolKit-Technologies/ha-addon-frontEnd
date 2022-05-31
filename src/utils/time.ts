import moment from 'moment'
/**
 *
 * 根据时间和要显示的跨度时间生成时间轴数组
 * @export
 * @param {Date} time 时间类型对象
 * @param {('hour'|'day'|'month')} type x轴显示，天/月/半年
 */
export function generateTimeList(type: 'oneDay' | 'oneMonth' | 'halfYear', time?: Date) {
    let dateTime = new Date()
    if (time) {
        dateTime = time
    }
    let timeList: (number | string)[] = []
    //按天查看---间隔为小时
    if (type === 'oneDay') {

        for (var i = 0; i < 24; i++) {
            const timeDate = new Date(new Date().setHours(dateTime.getHours() - i))

            const timeValue = moment(timeDate).format('HH:00')

            timeList.unshift(timeValue)
        }
    }

    //按月查看---间隔为天
    if (type === 'oneMonth') {


        for (var i = 0; i < 31; i++) {
            const timeDate = new Date(new Date().setDate(dateTime.getDate() - i))

            const timeValue = moment(timeDate).format('MM/DD')

            timeList.unshift(timeValue)
        }
    }


    //按半年查看---间隔为月
    if (type === 'halfYear') {
        for (var i = 0; i < 6; i++) {
            const timeDate = new Date(new Date().setMonth(dateTime.getMonth() - i))

            const timeValue = moment(timeDate).format('YY/MM')

            timeList.unshift(timeValue)
        }
    }

    return timeList
}
