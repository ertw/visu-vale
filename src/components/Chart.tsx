import * as React from 'react'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'
import { Dollars } from '../helpers/fetchData'
import moment from 'moment'

interface Props {
    dollars: Dollars
}

export const Chart = (props: Props) => {
    const { dollars } = props
    const formatXAxis = (tickItem: string) => {
        return (
            moment(tickItem).format('MM YY')
        )
    }

    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <AreaChart data={dollars}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis type="number" domain={[dataMin => (dataMin - 10), 'dataMax']} />
                <XAxis dataKey="date" tickFormatter={formatXAxis} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                <Tooltip />
            </AreaChart>
        </ResponsiveContainer>
    )
}