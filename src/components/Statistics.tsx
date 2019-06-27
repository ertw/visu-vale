import * as React from 'react'
import {
    Row,
    Col,
    Statistic,
} from 'antd';
import { AppContext } from './AppStateWrapper'

interface LocalizedAppValue {
    [key: string]: {
        en_US: string
        es_ES: string
    }
}

const text: LocalizedAppValue = {
    statisticTitleHigh: { en_US: 'High', es_ES: 'Maximo' },
    statisticTitleLow: { en_US: 'Low', es_ES: 'Minimo' },
    statisticTitleAverage: { en_US: 'Average', es_ES: 'Promedio' },
}

export const Statistics = () => {
    return (
        <AppContext.Consumer>
            {value => {
                const { range } = value
                const locale = value.locale.locale
                const justDollars = range.map(dollar => dollar.value)
                const sum = (accumulator: number, currentValue: number) => accumulator + currentValue
                const max = (a: number, b: number) => (Math.max(a, b))
                const min = (a: number, b: number) => (Math.min(a, b))
                const average = justDollars.reduce(sum, 0) / justDollars.length
                const minimum = justDollars.reduce(min, Infinity)
                const maximum = justDollars.reduce(max, -Infinity)

                return (
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title={`⬆ ${locale === 'es' ? text.statisticTitleHigh.es_ES : text.statisticTitleHigh.en_US}`} value={maximum} />
                        </Col>
                        <Col span={8}>
                            <Statistic title={`⬇ ${locale === 'es' ? text.statisticTitleLow.es_ES : text.statisticTitleLow.en_US}`} value={minimum} />
                        </Col>
                        <Col span={8}>
                            <Statistic title={`⇔ ${locale === 'es' ? text.statisticTitleAverage.es_ES : text.statisticTitleAverage.en_US}`} value={average} precision={2} />
                        </Col>
                    </Row>
                )
            }}
        </AppContext.Consumer>
    )
}