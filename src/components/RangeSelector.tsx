import * as React from 'react'
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { DatePicker } from 'antd';
import moment from 'moment'
import { AppContext, } from './AppStateWrapper';
const { RangePicker, } = DatePicker

const momentFormatterString = 'YYYY-MM-DD'

export const RangeSelector = () => (
    <AppContext.Consumer>
        {value => {
            const { setRange, dollars } = value
            const onChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
                // console.log('From: ', dates[0], ', to: ', dates[1]);
                // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
                const startDate = dateStrings[0] || moment().format(momentFormatterString)
                const endDate = dateStrings[1] || moment().format(momentFormatterString)
                if (setRange) setRange(dollars, startDate, endDate)
                console.log('%%%%')
                console.log(value)
                console.log('%%%%')
            }
            const disabledDate = (current?: moment.Moment) => {
                const startOfDataset = current && current < moment(dollars[0].date)
                const endOfDataset = current && current > moment(dollars[dollars.length - 1].date).add(1, 'day')
                return !!(startOfDataset || endOfDataset)
                // /* BAD PERFORMANCE! */ const datesNotPresentInDataset = current && missingDates.find(missingDate => missingDate === moment(current).format('YYYY-MM-DD'))
            }

            return (
                <RangePicker
                    {...value}
                    disabledDate={disabledDate}
                    ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'This Year': [moment().startOf('year'), moment().endOf('year')],
                        'All Data': [moment(dollars[0].date), moment()],
                    }}
                    onChange={onChange}
                    style={{ marginBottom: '1rem', float: 'left' }}
                    defaultValue={[moment(), moment()]}
                />
            )
        }}
    </AppContext.Consumer>
)