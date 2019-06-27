import * as React from 'react'
import {
    Radio,
    Typography,
} from 'antd';
import { AppContext, } from './AppStateWrapper';
import es_ES from 'antd/lib/locale-provider/es_ES';
import en_US from 'antd/lib/locale-provider/en_US';
import { RadioChangeEvent } from 'antd/lib/radio';
const { Text } = Typography

export const LanguageSelector = () => (
    <AppContext.Consumer>
        {value => {
            const { locale, setLocale } = value
            const changeLocale = (e: RadioChangeEvent) => {
                const localeValue = (e.target as HTMLInputElement).value
                if (setLocale) setLocale(localeValue)
            }
            return (
                <React.Fragment>
                    <div>
                        <Text>
                            {locale.locale === 'es' ? 'Idioma' : 'Language'}:
                    </Text>
                    </div>
                    <Radio.Group
                        defaultValue={locale}
                        onChange={changeLocale}
                    >
                        <Radio.Button key="en" value={en_US}>
                            <span role='img' aria-label='fl-us'>🇺🇸</span> EN
                            </Radio.Button>
                        <Radio.Button key="es" value={es_ES}>
                            <span role='img' aria-label='fl-cl'>🇨🇱 </span> ES
                            </Radio.Button>
                    </Radio.Group>
                </React.Fragment>
            )
        }}
    </AppContext.Consumer>
)
