import * as React from 'react'
import {
    fetchData,
    Dollars,
} from '../helpers/fetchData'
import {
    LocaleProvider,
    Icon,
    Spin,
    Typography,
    Card,
} from 'antd'
import moment from 'moment'
import { Locale } from 'antd/lib/locale-provider';
const { Title } = Typography

export interface State {
    error: any,
    isLoaded: boolean,
    dollars: Dollars
    range: Dollars
    setRange?: (dollars: Dollars, start: string, end: string) => void
    locale: Locale | any
    setLocale?: (locale: string) => void
}

interface Props { }

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

const getRange = (dollars: Dollars, start: string, end: string) => {
    const getIndex = (date: string) => (dollars.findIndex(dollar => dollar.date === date))
    let startIndex = getIndex(start)
    let endIndex = getIndex(end)
    /* look up to 10 days ahead when missing data */
    for (let i = 1; startIndex === -1 && i < 10; i++) {
        startIndex = getIndex(moment(start).add(i, 'day').format(momentFormatterString))
    }
    /* look up to 365 days behind when missing data */
    for (let i = 1; endIndex === -1 && i < 365; i++) {
        endIndex = getIndex(moment(end).subtract(i, 'day').format(momentFormatterString))
    }
    return (
        dollars.slice(startIndex, endIndex + 1)
    )
}

export const AppContext = React.createContext(
    {
        error: null,
        isLoaded: false,
        dollars: [],
        range: [],
        locale: null
    } as State
)


interface CustomWindow extends Window {
    state: State
}
declare let window: CustomWindow;

export const momentFormatterString = 'YYYY-MM-DD'

export class AppStateWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            dollars: [],
            range: [],
            locale: null
        }
    }

    componentDidMount() {
        ; (async () => {
            this.setState(
                await fetchData()
            )
            this.setState({ setRange: (dollars: Dollars, start: string, end: string) => this.setState({ range: getRange(dollars, start, end) }) })
            this.setState({ setLocale: (locale: Locale['locale']) => this.setState({ locale }) })
        }
        )()
    }

    componentDidUpdate() {
        if (process.env.NODE_ENV) {
            /* put state  on window for ease of debugging */
            window.state = this.state
        }
    }

    render() {
        const {
            error,
            isLoaded,
            locale,
        } = this.state
        const { children } = this.props

        if (error) {
            return (
                <div>{errorStringer(error) || 'ERROR'}</div>
            )
        }
        if (!isLoaded) {
            const antIcon = <Icon type="loading" style={{ fontSize: 38 }} spin />;
            return (
                <Card bordered={false}>
                    <div style={{ display: 'flex' }}>
                        <Spin indicator={antIcon} style={{ marginRight: '1rem' }} />
                        <Title>Loading external data</Title>
                    </div>
                </Card>
            )
        }
        return (
            <LocaleProvider locale={locale}>
                <AppContext.Provider value={{ ...this.state }}>
                    {children}
                </AppContext.Provider>
            </LocaleProvider>
        )
    }
}
