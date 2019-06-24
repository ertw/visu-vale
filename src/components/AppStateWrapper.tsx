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
            <div>
                {dollars.map(dollar => dollar.Fecha)}
            </div>
        )
    }
}
