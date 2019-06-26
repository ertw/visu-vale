import { State } from '../components/AppStateWrapper'
import moment from 'moment'

interface RawDollar {
    Valor: string
    Fecha: string
}

interface RawDollars extends Array<RawDollar> { }

interface RawDollarsByYear {
    Dolares: RawDollars
}

export interface Dollar {
    value: number
    date: string
}

export interface Dollars extends Array<Dollar> { }

const endpoint = 'https://api.sbif.cl/api-sbifv3/recursos_api'

const endpointConstructor = ({
    year = '',
    format = 'json',
    apiKey = process.env.REACT_APP_SBIF_API_KEY,
    anterior = false,
}) => (`${endpoint}/dolar${anterior && year ? '/anteriores' : ''}${year ? '/' + year : ''}?apikey=${apiKey}&formato=${format}`)

const makeSingleRequest = async function () {
    const apiResponse: Promise<RawDollarsByYear> = await fetch(endpointConstructor({ year: '2020', anterior: true }))
        .then(resp => {
            if (resp.ok) {
                return resp.json()
            }
            throw Error(resp.statusText)
        })
    return apiResponse
}

const getMissingDates = (dollars: Dollars) => (dollars.reduce(function (accumulator: string[], currentValue, currentIndex, sourceArray) {
    const daysFromNow = (dollar: Dollar, days: number) => (moment(dollar.date).add(days, 'day').format('YYYY-MM-DD'))
    if (
        currentIndex < sourceArray.length - 1 &&
        moment(currentValue.date).diff(moment(sourceArray[currentIndex + 1].date), 'day') === -3) {
        return (accumulator.concat([
            daysFromNow(currentValue, 1),
            daysFromNow(currentValue, 2)
        ]))
    }
    return accumulator
}, []))


export const fetchData = async (): Promise<State> => {
    try {
        /* get the raw data from the api */
        const dollarsByYear = await makeSingleRequest()
        /* transform the data into a more convenient shape */
        const dollars: Dollars = dollarsByYear.Dolares.map((dollar: RawDollar) => ({ value: parseInt(dollar.Valor), date: dollar.Fecha }))
        return ({
            isLoaded: true,
            error: null,
            dollars,
            range: dollars,
            missingDates: getMissingDates(dollars)
        })
    } catch (error) {
        return ({
            isLoaded: false,
            error,
            dollars: [],
            range: [],
            missingDates: []
        })
    }
}