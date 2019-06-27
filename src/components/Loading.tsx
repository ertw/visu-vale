import * as React from 'react'
import styles from './Loading.module.css'

import {
    Spin,
    Typography,
    Icon,
} from "antd"
const { Title } = Typography
const antIcon = <Icon type="loading" style={{ fontSize: 38 }} spin />;

export const Loading = () => (
    <div className={styles.loading}>
        <Spin indicator={antIcon} style={{ marginRight: '1rem' }} />
        <Title>Loading external data</Title>
    </div>
)