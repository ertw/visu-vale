import * as React from 'react'
import {
    fetchData,
    Dollars,
} from '../helpers/fetchData'
import { Chart } from './Chart'
import { DatePicker, } from 'antd'
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
    return (
        dollars.slice(getIndex(start), getIndex(end))
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
        const { error, isLoaded, dollars } = this.state
        const justDollars = dollars.map(dollar => dollar.value)
        const average = justDollars.reduce(sum, 0) / justDollars.length
        const minimum = justDollars.reduce(min, Infinity)
        const maximum = justDollars.reduce(max, -Infinity)
        function onChange(dates: RangePickerValue, dateStrings: [string, string]) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        }
        const disabledDate = (current?: moment.Moment) => {
            return (
                current ? current < moment('2015-01-02') : false
            )
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
                    disabledDate={current => (current ? current < moment('2015-01-02') : false)}
                    ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={onChange}
                />
                <Chart dollars={getDateRange(dollars, '2015-08-27', '2016-01-21')} />
            </React.Fragment>
        )
    }
}
