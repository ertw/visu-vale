import { State } from '../components/AppStateWrapper'

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
                console.log('#####')
                console.log(resp.headers.get('Content-Length'))
                console.log('#####')
                return resp.json()
            }
            throw Error(resp.statusText)
        })
    return apiResponse
}

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
        })
    } catch (error) {
        return ({
            isLoaded: false,
            error,
            dollars: [],
            range: [],
        })
    }
}