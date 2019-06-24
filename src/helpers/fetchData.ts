import { State } from '../components/AppStateWrapper'

// API error response:
interface ErrorResponse {
    CodigoHTTP: 421 | 422 | number
    CodigoError: 91 | number
    Mensaje: "API key no valida" | "Entidad Improcesable" | string
}

export interface Dollar {
    Valor: string
    Fecha: string
}

export interface Dollars extends Array<Dollar> { }

export interface DollarsByYear {
    Dolares: Dollars
}

const endpoint = 'https://api.sbif.cl/api-sbifv3/recursos_api'
// https://api.sbif.cl/api-sbifv3/recursos_api/dolar/2010?apikey=API_KEY&formato=json
// https://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=API_KEY&formato=json

const endpointConstructor = ({
    year = '',
    format = 'json',
    apiKey = process.env.REACT_APP_SBIF_API_KEY
}) => (`${endpoint}/dolar${year ? '/' + year : ''}?apikey=${apiKey}&formato=${format}`)

const makeSingleRequest = async function () {
    const apiResponse: Promise<DollarsByYear> = await fetch(endpointConstructor({ year: '2010' }))
        .then(resp => {
            if (resp.ok) {
                return resp.json()
            }
            throw Error(resp.statusText)
        })
    return apiResponse
}

export const fetchData = async (): Promise<State> => {
    try {
        const dollarsByYear = await makeSingleRequest()
        const flattenedDollars = dollarsByYear.Dolares
        return ({
            isLoaded: true,
            error: null,
            dollars: flattenedDollars
        })
    } catch (error) {
        return ({
            isLoaded: false,
            error,
            dollars: []
        })
    }
}