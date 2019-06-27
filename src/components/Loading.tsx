import * as React from 'react'
import styles from './Loading.module.css'

import {
    Spin,
    Typography,
    Icon,
} from "antd"
import { AppContext } from './AppStateWrapper';
const { Title } = Typography
const antIcon = <Icon type="loading" className={styles.icon} spin />

export const Loading = () => {
    return (
        <AppContext.Consumer>
            {value => {
                const { locale } = value

                return (
                    <div className={styles.loading}>
                        <Spin indicator={antIcon} className={styles.spin} />
                        <Title>{locale.locale === 'es' ? 'Cargando' : 'Loading'}</Title>
                    </div>
                )
            }}
        </AppContext.Consumer>
    )
}