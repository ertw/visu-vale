import * as React from 'react'
import { AppContext } from './AppStateWrapper'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'

const Chart = () => {
    return (
        < AppContext.Consumer >
            {state => (
                <ResponsiveContainer width={"100%"} height={400}>
                    <AreaChart data={state.range}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis
                            type="number"
                            domain={[dataMin => (dataMin - 10), 'dataMax']}
                            tick={false}
                            width={0}
                        />
                        <XAxis
                            dataKey="date"
                            tick={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                        />
                        <Tooltip />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </AppContext.Consumer >
    )
}

export default Chart