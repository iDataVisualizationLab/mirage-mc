import {IconButton, Menu, MenuItem} from "@mui/material";
import {
    Brightness4 as Brightness4Icon,
    BrightnessHigh as BrightnessHighIcon,
    FormatSize,
    Help as HelpIcon, Language
} from "@mui/icons-material";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {useTheme as useAppTheme} from "material-ui-shell/lib/providers/Theme";
import {SET_MENU} from "../../reducer/actions/setting";
import {useDispatch} from "react-redux";
import {useIntl} from "react-intl";
import LanguageMenu from "./LanguageMenu";
import FontSizeMenu from "./FontSizeMenu";
import LayoutMenu from "./LayoutMenu";

export default function ({layoutItems,layoutItemsOnChange=()=>{}}){
    const intl = useIntl();
    const dispatch = useDispatch();
    const { toggleThisTheme, isDarkMode } = useAppTheme()
    return <>
        <img src={require('../../assets/logo.png')} loading="lazy" style={{height:'auto',width:150}}></img>
        <IconButton title={"About us"} size={"small"} sx={{transform:"translate(-10px,10px)"}}
        onClick={()=>dispatch({ type: SET_MENU, opened: true })}>
            <HelpIcon fontSize="inherit"/>
        </IconButton>
        <IconButton
            title={"Toggle theme"}
            onClick={() => {
                toggleThisTheme('isDarkMode')
            }}
        >
            {isDarkMode ? (
                <BrightnessHighIcon/>
            ) : (
                <Brightness4Icon/>
            )}
        </IconButton>
        {/*layoutItems*/}
        <LayoutMenu intl={intl} layoutItems={layoutItems} onChange={layoutItemsOnChange}/>
        <FontSizeMenu intl={intl}/>
        <LanguageMenu intl={intl}/>
    </>
}