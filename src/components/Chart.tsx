import * as React from 'react'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
} from 'recharts'

interface Datum {
    x: number
    y: number
}

interface Data extends Array<Datum> { }

interface Props {
    data: Data
}

export const Chart = (props: Props) => {
    const { data } = props
    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <AreaChart data={data}>
                <YAxis type="number" domain={['dataMin', 'dataMax']} />
                <XAxis />
                <Area dataKey="y" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    )
}