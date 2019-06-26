import * as React from 'react'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
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
                <YAxis type="number" domain={['dataMin', 'dataMax']} />
                <XAxis dataKey="date" tickFormatter={formatXAxis} />
                <Area dataKey="value" stroke="#8884d8" fill="#8884d8" />
                <Tooltip />
            </AreaChart>
        </ResponsiveContainer>
    )
}