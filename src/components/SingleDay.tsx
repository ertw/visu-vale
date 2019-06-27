import * as React from 'react'
import { AppContext } from './AppStateWrapper'
import styles from './SingleDay.module.css'

export const SingleDay = () => {
    return (
        <AppContext.Consumer>
            {value => {
                const { range } = value
                const day = range[0] || 'error'

                return (
                    <div className={styles.singleDay}>
                        <span className={styles.prefix}>
                            $
                            </span>
                        <span className={styles.value}>
                            {day.value}
                        </span>
                        <span className={styles.suffix}>
                            CLP
                            </span>
                    </div>
                )
            }}
        </AppContext.Consumer>
    )
}