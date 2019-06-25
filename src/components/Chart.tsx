import * as React from 'react'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
} from 'recharts'
import { Dollars } from '../helpers/fetchData';

interface Datum {
    x: number
    y: number
}

interface Data extends Array<Datum> { }

interface Props {
    dollars: Dollars
}

export const Chart = (props: Props) => {
    const { dollars } = props
    console.log('***')
    console.log(dollars)
    console.log('***')
    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <AreaChart data={dollars}>
                <YAxis type="number" domain={['dataMin', 'dataMax']} />
                <XAxis />
                <Area dataKey="value" stroke="#8884d8" fill="#8884d8" />
                <Tooltip />
            </AreaChart>
        </ResponsiveContainer>
    )
}