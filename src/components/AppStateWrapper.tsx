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
}

interface Props { }

export const AppContext = React.createContext(
    {
        error: null,
        isLoaded: false,
        dollars: []
    } as State
)

const errorStringer = (error: Error) => {
    if (error.message === '421') {
        return "invalid api token"
    }
    if (error.message === '422') {
        return "bad request given to api"
    }
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



export class AppStateWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            dollars: []
        }
    }

    componentDidMount() {
        ; (async () => {
            this.setState(
                await fetchData()
            )
        })()
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
        console.log(this.state.dollars)

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
