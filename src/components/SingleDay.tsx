import * as React from 'react'
import {
    Statistic,
} from 'antd';
import { AppContext } from './AppStateWrapper'

interface LocalizedAppValue {
    [key: string]: {
        en_US: string
        es_ES: string
    }
}

export const SingleDay = () => {
    return (
        <AppContext.Consumer>
            {value => {
                const { range } = value
                const day = range[0] || 'error'

                return (
                    <Statistic
                        title={day.date}
                        value={day.value}
                        prefix='$'
                        suffix='CLP'
                    />
                )
            }}
        </AppContext.Consumer>
    )
}