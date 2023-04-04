import React from 'react'
import { useMenu } from 'material-ui-shell/lib/providers/Menu'
import { useTheme as useAppTheme } from 'material-ui-shell/lib/providers/Theme'
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
} from '@mui/material'
import {
    ChevronLeft,
    ChevronRight,
    ChromeReaderMode,
    Person as PersonIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Brightness4 as Brightness4Icon,
    BrightnessHigh as BrightnessHighIcon, Image,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const MenuHeader = () => {
    const { toggleThisTheme, isDarkMode, isRTL } = useAppTheme()
    const menuContext = useMenu()
    const theme = useTheme()
    const {
        toggleThis,
        isDesktop,
        isMiniMode,
        isMenuOpen,
        isMiniSwitchVisibility,
        isAuthMenuOpen,
    } = menuContext || {}

    const isAuthenticated = false;
    const AvatarConstructor = ({ src, alt, avatar }) => {
        return (
            <ListItemAvatar onClick={() => toggleThis('isAuthMenuOpen')}>
                <Avatar src={src} alt={alt}>
                    {avatar}
                </Avatar>
            </ListItemAvatar>
        )
    }

    const styles = {
        icon: {
            color: theme.palette.grey.A100,
            cursor: 'pointer',
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
    }

    return (
        <Paper
            square={true}
            elevation={3}
            sx={{
                backgroundColor: (t) =>
                    t.palette.mode === 'dark'
                        ? t.palette.background.default
                        : t.palette.primary.dark,
                margin: 0,
                padding: 0,
            }}
        >
            {isMiniMode && isAuthenticated && (
                <div style={{ ...styles.toolbar }}></div>
            )}
            <List sx={{ ...(!isAuthenticated ? styles.toolbar : {}) }}>
                {!isMiniMode && (
                    <ListItem
                        sx={{
                            color: (t) => theme.palette.grey.A100,
                            cursor: 'pointer',
                            ...theme.mixins.toolbar,
                        }}
                    >
                        <ListItemSecondaryAction>
                            <img
                                src={require('../../assets/logo.png')} loading="lazy" style={{height:'auto',width:100, transform:'translateY(30%)'}}></img>
                            <IconButton
                                onClick={() => {
                                    toggleThisTheme('isDarkMode')
                                }}
                            >
                                {isDarkMode ? (
                                    <BrightnessHighIcon sx={{ ...styles.icon }} />
                                ) : (
                                    <Brightness4Icon sx={{ ...styles.icon }} />
                                )}
                            </IconButton>
                            {isDesktop && (
                                <>
                                    {isMiniSwitchVisibility && (
                                        <IconButton
                                            onClick={() => {
                                                toggleThis('isMiniMode', true)
                                                toggleThis('isMenuOpen', false)
                                            }}
                                        >
                                            <ChromeReaderMode sx={{ ...styles.icon }} />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            toggleThis('isMenuOpen', false)
                                        }}
                                    >
                                        {isRTL ? (
                                            <ChevronRight sx={{ ...styles.icon }} />
                                        ) : (
                                            <ChevronLeft sx={{ ...styles.icon }} />
                                        )}
                                    </IconButton>{' '}
                                </>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
        </Paper>
    )
}

export default MenuHeader