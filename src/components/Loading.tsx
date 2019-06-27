import * as React from 'react'

import {
    Card,
    Spin,
    Typography,
    Icon,
} from "antd"
const { Title } = Typography
const antIcon = <Icon type="loading" style={{ fontSize: 38 }} spin />;

export const Loading = () => (
    <Card bordered={false}>
        <div style={{ display: 'flex' }}>
            <Spin indicator={antIcon} style={{ marginRight: '1rem' }} />
            <Title>Loading external data</Title>
        </div>
    </Card>
)