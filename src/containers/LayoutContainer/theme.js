import { createTheme } from '@mui/material/styles'

const getThemeSource = (id, ts, isDarkMode, isRTL) => {
    if (ts) {
        for (let i = 0; i < ts.length; i++) {
            if (ts[i]['id'] === id) {
                const _source = ts[i]['source']
                const source = _source != null ?(_source instanceof Function ?_source(isDarkMode ? 'dark' : 'light'):_source):_source;
                const palette = source != null ? source.palette : {}
                return createTheme({
                    ...source,
                    palette: { ...palette, mode: isDarkMode ? 'dark' : 'light' },
                    direction: isRTL ? 'rtl' : 'ltr',
                })
            }
        }
    }

    return createTheme({
        palette: { mode: isDarkMode ? 'dark' : 'light' },
        direction: isRTL ? 'rtl' : 'ltr',
    })
}

export default getThemeSource