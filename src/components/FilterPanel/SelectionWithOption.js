import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function SelectionWithOption() {
    return <Stack direction={"row"}>
        <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
        >
            <ArrowDropDownIcon />
        </Button>
    </Stack>
}