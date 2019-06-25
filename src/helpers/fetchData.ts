import { State } from '../components/AppStateWrapper'
import moment from 'moment'

// API error response:
interface ErrorResponse {
    CodigoHTTP: 421 | 422 | number
    CodigoError: 91 | number
    Mensaje: "API key no valida" | "Entidad Improcesable" | string
}

interface RawDollar {
    Valor: string
    Fecha: string
}

interface RawDollars extends Array<RawDollar> { }

export interface Dollar {
    value: number
    date: string
}

export interface Dollars extends Array<Dollar> { }

export interface RawDollarsByYear {
    Dolares: RawDollars
}

const endpoint = 'https://api.sbif.cl/api-sbifv3/recursos_api'
// https://api.sbif.cl/api-sbifv3/recursos_api/dolar/2010?apikey=API_KEY&formato=json
// https://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=API_KEY&formato=json
// https://api.sbif.cl/api-sbifv3/recursos_api/dolar/anteriores/2009?apikey=API_KEY&formato=json

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
        console.log('*')
        return (accumulator.concat([
            daysFromNow(currentValue, 1),
            daysFromNow(currentValue, 2)
        ]))
    }
    return accumulator
}, []))


export const fetchData = async (): Promise<State> => {
    try {
        // get the raw data from the api
        const dollarsByYear = await makeSingleRequest()
        // transform the data into a more convenient shape
        const dollars: Dollars = dollarsByYear.Dolares.map((dollar: RawDollar) => ({ value: parseInt(dollar.Valor), date: dollar.Fecha }))
        return ({
            isLoaded: true,
            error: null,
            dollars,
            range: [],
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