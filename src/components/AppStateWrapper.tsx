import * as React from 'react'
import {
    fetchData,
    Dollars,
} from '../helpers/fetchData'
import Chart from './Chart'
import {
    LocaleProvider,
    Icon,
    Spin,
    Typography,
    Card,
    Radio,
} from 'antd'
import es_ES from 'antd/lib/locale-provider/es_ES';
import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment'
import { RadioChangeEvent } from 'antd/lib/radio';
import { Locale } from 'antd/lib/locale-provider';
import { RangeSelector } from './RangeSelector'
import { Statistics } from './Statistics'
const { Title } = Typography

export interface State {
    error: any,
    isLoaded: boolean,
    dollars: Dollars
    range: Dollars
    locale?: Locale | any
    setRange?: any
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

export const AppContext = React.createContext(
    {
        error: null,
        isLoaded: false,
        dollars: [],
        range: [],
        setRange: () => { }
    } as State
)


interface CustomWindow extends Window {
    moment: Function
    state: State
}
declare let window: CustomWindow;



class AppStateWrapper extends React.Component<Props, State> {
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
            this.setState({ setRange: (dollars: Dollars, start: string, end: string) => this.setState({ range: getRange(dollars, start, end) }) })
        }
        )()
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
            locale,
        } = this.state
        const changeLocale = (e: RadioChangeEvent) => {
            const localeValue = (e.target as HTMLInputElement).value
            this.setState({ locale: localeValue })
        }

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
                    <React.Fragment>
                        <Card bordered={false}>
                            <RangeSelector />
                            <Radio.Group
                                defaultValue={locale}
                                onChange={changeLocale}
                                style={{ float: 'right' }}
                            >
                                <Radio.Button key="en" value={en_US}>
                                    <span role='img' aria-label='fl-us'>🇺🇸</span> EN
                            </Radio.Button>
                                <Radio.Button key="es" value={es_ES}>
                                    <span role='img' aria-label='fl-cl'>🇨🇱 </span> ES
                            </Radio.Button>
                            </Radio.Group>
                        </Card>
                        <Card bordered={false}>
                            <Statistics />
                        </Card>
                        <Card bordered={false}>
                            <Chart />
                        </Card>
                    </React.Fragment>
                </AppContext.Provider>
            </LocaleProvider>
        )
    }
}

export default AppStateWrapper