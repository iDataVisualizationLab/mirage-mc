import React from 'react'
import {
  AccountBox as AccountBoxIcon,
  ChatBubble,
  ChromeReaderMode,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  FilterList,
  FormatTextdirectionRToL as RTLIcon,
  FormatTextdirectionLToR as LTRIcon,
  GetApp,
  InfoOutlined,
  Language as LanguageIcon,
  Lock as LockIcon,
  MenuOpen as MenuOpenIcon,
  QuestionAnswer,
  SettingsApplications as SettingsIcon,
  Style as StyleIcon,
  Tab,
  ViewList,
  Web,
  FilterAlt,
  Home as HomeIcon,
    Map as MapIcon,
    FileUpload,
  FormatSize
} from '@mui/icons-material';

import allLocales from './locales'
import allThemes from './themes'
// import FilterPanel from "../components/FilterPanel/index_static";
import FilterPanel from "../components/FilterPanel";
import FontsizeControl from "../components/FontsizeControl";

const getMenuItems = (props) => {
  const {
    intl,
    updateLocale,
    locale,
    menuContext,
    themeContext,
    a2HSContext,
    auth: authData,
    openAbout,
    changeFontSize,
  } = props

  const { toggleThis, isDesktop, isAuthMenuOpen, isMiniSwitchVisibility } =
    menuContext
  const { themeID, setThemeID, isRTL, fontSize, toggleThisTheme, setFontSize } = themeContext
  const { auth, setAuth } = authData
  const { isAppInstallable, isAppInstalled, deferredPrompt } = a2HSContext

  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale)
      },
      leftIcon: <LanguageIcon />,
    }
  })

  const isAuthorised = auth.isAuthenticated

  const themeItems = allThemes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => {
        setThemeID(t.id)
      },
      leftIcon: <StyleIcon style={{ color: t.color }} />,
    }
  })

  // if (isAuthMenuOpen || !isAuthorised) {
  //   return [
  //     {
  //       value: '/my_account',
  //       primaryText: intl.formatMessage({
  //         id: 'my_account',
  //         defaultMessage: 'My Account',
  //       }),
  //       leftIcon: <AccountBoxIcon />,
  //     },
  //   ]
  // }
  return [
    {
      value: null,
      onClick: () => {
        deferredPrompt.prompt()
      },
      primaryText: intl.formatMessage({
        id: 'search',
        defaultMessage: 'Search',
      }),
      leftIcon: <FilterAlt />,
      primaryTogglesNestedList: true,
      nestedItems: [
        {
          primaryText: <FilterPanel/>
        }
      ]
    },
    {
      value: '/',
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: 'home' }),
      leftIcon: <HomeIcon />,
    },
    {
      value: null,
      visible: true,
      primaryText: intl.formatMessage({ id: 'about' }),
      leftIcon: <InfoOutlined />,
      onClick:openAbout
    },
    { divider: true },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primaryTogglesNestedList: true,
      leftIcon: <SettingsIcon />,
      nestedItems: [
        {
          primaryText: <FontsizeControl title={intl.formatMessage({id: 'Font size'})}
                                        onChange={changeFontSize}/>,
          leftIcon: <FormatSize/>,
        },
        {
          primaryText: intl.formatMessage({ id: 'theme' }),
          secondaryText: intl.formatMessage({ id: themeID }),
          primaryTogglesNestedList: true,
          leftIcon: <StyleIcon />,
          nestedItems: themeItems,
        },
        {
          primaryText: intl.formatMessage({ id: 'language' }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <LanguageIcon />,
          nestedItems: localeItems,
        },
        {
          visible: isDesktop ? true : false,
          onClick: () => {
            toggleThis('isMiniSwitchVisibility')
          },
          primaryText: intl.formatMessage({
            id: 'menu_mini_mode',
          }),
          leftIcon: isMiniSwitchVisibility ? (
            <MenuOpenIcon />
          ) : (
            <ChromeReaderMode />
          ),
        },
        {
          onClick: () => {
            toggleThisTheme('isRTL')
          },
          primaryText: `${isRTL ? 'LTR' : 'RTL'} mode`,
          leftIcon: isRTL ? <LTRIcon /> : <RTLIcon />,
        },
      ],
    },
    {
      value: null,
      visible: isAppInstallable && !isAppInstalled,
      onClick: () => {
        deferredPrompt.prompt()
      },
      primaryText: intl.formatMessage({
        id: 'install',
        defaultMessage: 'Install',
      }),
      leftIcon: <GetApp />,
    },
  ]
}
export default getMenuItems
