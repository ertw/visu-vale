import * as React from 'react'
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { DatePicker } from 'antd';
import moment from 'moment'
import { AppContext, momentFormatterString } from './AppStateWrapper';
const { RangePicker, } = DatePicker

export const RangeSelector = () => (
    <AppContext.Consumer>
        {value => {
            const { setRange, dollars, locale } = value
            const onChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
                const startDate = dateStrings[0] || moment().format(momentFormatterString)
                const endDate = dateStrings[1] || moment().format(momentFormatterString)
                if (setRange) setRange(dollars, startDate, endDate)
            }
            const disabledDate = (current?: moment.Moment) => {
                const startOfDataset = current && current < moment(dollars[0].date)
                const endOfDataset = current && current > moment(dollars[dollars.length - 1].date).add(1, 'day')
                return !!(startOfDataset || endOfDataset)
            }
            const rangepickerToday = locale.locale === 'es' ? 'Hoy' : 'Today'
            const rangepickerMonth = locale.locale === 'es' ? 'Este Mes' : 'This Month'
            const rangepickerYear = locale.locale === 'es' ? 'Este Año' : 'This Year'
            const rangepickerAll = locale.locale === 'es' ? 'Todo' : 'All Data'

            return (
                <RangePicker
                    {...value}
                    disabledDate={disabledDate}
                    ranges={{
                        [rangepickerToday]: [moment(), moment()],
                        [rangepickerMonth]: [moment().startOf('month'), moment().endOf('month')],
                        [rangepickerYear]: [moment().startOf('year'), moment().endOf('year')],
                        [rangepickerAll]: [moment(dollars[0].date), moment()],
                    }}
                    onChange={onChange}
                    style={{ marginBottom: '1rem', float: 'left' }}
                    defaultValue={[moment(), moment()]}
                />
            )
        }}
    </AppContext.Consumer>
)