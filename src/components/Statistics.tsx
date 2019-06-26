import * as React from 'react'
import {
    Row,
    Col,
    Statistic,
} from 'antd';
import { AppContext } from './AppStateWrapper'

export const Statistics = () => {
    return (
        <AppContext.Consumer>
            {value => {
                const { range } = value
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
                            <Statistic title="⬆ High" value={maximum} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="⬇ Low" value={minimum} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="⇔ Average" value={average} precision={2} />
                        </Col>
                    </Row>
                )
            }
            }
        </AppContext.Consumer>
    )
}