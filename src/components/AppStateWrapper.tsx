import * as React from 'react'
import {
    fetchData,
    Dollars,
} from '../helpers/fetchData'
import { Chart } from './Chart'
import {
    DatePicker,
    Statistic,
    Empty,
    Progress,
    } from 'antd'
import moment from 'moment'
import { RangePickerValue } from 'antd/lib/date-picker/interface';
const { RangePicker, } = DatePicker

export interface State {
    error: any,
    isLoaded: boolean,
    dollars: Dollars
    range: Dollars
}

interface Props { }

export const AppContext = React.createContext(
    {
        error: null,
        isLoaded: false,
        dollars: [],
        range: [],
        missingDates: []
    } as State
)

const errorStringer = (error: Error) => {
    if (error.message === '421') {
        return "invalid api token"
    }
    if (error.message === '422') {
        return "bad request given to api"
    }
    if (error.message === 'Failed to fetch') {
        return 'timeout when attempting to fetch data from api'
    }
    console.error('-----', error.message, error, '^^^^^')
    return (null)
}

const sum = (accumulator: number, currentValue: number) => accumulator + currentValue
const max = (a: number, b: number) => (Math.max(a, b))
const min = (a: number, b: number) => (Math.min(a, b))
const getDateRange = (dollars: Dollars, start: string, end: string) => {
    const getIndex = (date: string) => (dollars.findIndex(dollar => dollar.date === date))
    let startIndex = getIndex(start)
    let endIndex = getIndex(end)
    /* look up to 10 days ahead when missing data */
    for (let i = 1; startIndex === -1 && i < 10; i++) {
        startIndex = getIndex(moment(start).add(i, 'day').format('YYYY-MM-DD'))
    }
    /* look up to 365 days behind when missing data */
    for (let i = 1; endIndex === -1 && i < 365; i++) {
        endIndex = getIndex(moment(end).subtract(i, 'day').format('YYYY-MM-DD'))
    }
    return (
        dollars.slice(startIndex, endIndex + 1)
    )
}

interface CustomWindow extends Window {
    moment: Function
    state: State
}
declare let window: CustomWindow;



export class AppStateWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            dollars: [],
            range: [],
        }
    }

    componentDidMount() {
        ; (async () => {
            this.setState(
                await fetchData()
            )
        })()
        // put state and moment on window for ease of debugging
        window.moment = moment
    }

    componentDidUpdate() {
        // put state and moment on window for ease of debugging
        window.state = this.state
    }

    render() {
        const {
            error,
            isLoaded,
            dollars,
            range,
            // missingDates,
        } = this.state
        const justDollars = range.map(dollar => dollar.value)
        const average = justDollars.reduce(sum, 0) / justDollars.length
        const minimum = justDollars.reduce(min, Infinity)
        const maximum = justDollars.reduce(max, -Infinity)
        const onChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            this.setState({ range: getDateRange(dollars, dateStrings[0], dateStrings[1]) || dollars })
        }
        const disabledDate = (current?: moment.Moment) => {
            const startOfDataset = current && current < moment(dollars[0].date)
            const endOfDataset = current && current > moment(dollars[dollars.length - 1].date).add(1, 'day')
            return !!(startOfDataset || endOfDataset)
            // /* BAD PERFORMANCE! */ const datesNotPresentInDataset = current && missingDates.find(missingDate => missingDate === moment(current).format('YYYY-MM-DD'))
        }

        if (error) {
            return (
                <div>{errorStringer(error) || 'ERROR'}</div>
            )
        }
        if (!isLoaded) {
            return (
                <div>LOADING EXTERNAL DATA</div>
            )
        }
        return (
            <React.Fragment>
                <div>Average: {average}</div>
                <div>Minimum: {minimum}</div>
                <div>Maximum: {maximum}</div>
                <div>Current: {justDollars[justDollars.length - 1]}</div>
                <RangePicker
                    disabledDate={disabledDate}
                    ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'This Year': [moment().startOf('year'), moment().endOf('year')],
                        'All Data': [moment(dollars[0].date), moment()],
                    }}
                    onChange={onChange}
                />
                <Chart dollars={range} />
            </React.Fragment>
        )
    }
}
