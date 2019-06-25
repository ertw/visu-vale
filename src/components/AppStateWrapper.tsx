import * as React from 'react'
import { fetchData, Dollars } from '../helpers/fetchData'

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
        const justDollars = dollars.map(dollar => parseInt(dollar.Valor))
        const average = justDollars.reduce(sum, 0) / justDollars.length
        const minimum = justDollars.reduce(min, Infinity)
        const maximum = justDollars.reduce(max, -Infinity)
        console.log(justDollars)

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
                <div>
                    {dollars.map((dollar, index) => <div key={index}>{`{x: ${dollar.Fecha}, y: ${parseInt(dollar.Valor)} },`}</div>)}
                </div>
            </React.Fragment>
        )
    }
}
