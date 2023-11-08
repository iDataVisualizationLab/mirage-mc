import React, { useState, Fragment } from 'react'
import QuestionDialog from '../../components/Dialog'
import { useDispatch, useSelector } from 'react-redux';
import {SET_MENU} from "../../reducer/actions/setting";
import {Link, Stack, Typography} from "@mui/material";
import {Image} from "@mui/icons-material";
import spotifylogo from "../../assets/spotifylogo.png"


const AboutDialog = ({ children }) => {
    const dispatch = useDispatch();
    const dialogOpen = useSelector((state) => state.customization.opened);
    const [isProcessing, setIsProcessing] = useState(false)

    const closeDialog = () => {
        dispatch({ type: SET_MENU, opened: !dialogOpen });
    }
    // console.log('I am CCCCCCCCC')
    return (
        <Fragment>
            {children}
            <QuestionDialog
                isOpen={dialogOpen}
                handleClose={closeDialog}
                isProcessing={isProcessing}
                title={'About us'}
                maxWidth={"md"}
                message={<>
                    <Typography variant={"h5"} sx={{marginBottom:2}}>
                        Welcome to the Music Informatics for Radio Across the GlobE (MIRAGE) project! This online dashboard allows you to access, interact with, and export meta data and musicological features from the music found on internet radio.
                    </Typography>
                    <Typography variant={"h5"} sx={{marginBottom:2}}>
                        The MIRAGE dashboard consists of meta data (e.g., artist name, song title, etc.) for one million songs or events that were streaming on the Radio Garden streaming service during the months October-January 2022-2023. Each of 86 meta data variables pertaining to the location, station, stream, artist, and track was obtained from the Radio Garden API, the Internet Radio Station Stream Encoder, Annotator review, or the Spotify or Wikidata APIs.
                    </Typography>
                    <Typography variant={"h5"} sx={{marginBottom:1}}>
                        If you plan to use any of the data or visualizations available on the MIRAGE dashboard, please cite the following publication:
                    </Typography>
                    <Typography variant={"h5"} sx={{marginBottom:2,marginLeft:2}}>
                        Sears, David R. W., Goh, Ting Ting, Nguyen, Ngan V. T., and Tommy Dang. (2023). Developing corpora for musical traditions across the globe: Music analysis with the MIRAGE-MetaCorpus. Paper presented at the 46th annual meeting of the Society for Music Theory (SMT), Denver, CO, November 11.
                    </Typography>
                    <Typography variant={"h5"} sx={{marginBottom:2}}>
                        The source code for the MIRAGE dashboard is also available on Github: <Link color={'secondary'} href={'https://github.com/iDataVisualizationLab/mirage-mc'}
                        target={"_blank"}
                    >https://github.com/iDataVisualizationLab/mirage-mc</Link>
                    </Typography>
                    <Stack direction={"row"} width={'100%'} spacing={2} justifyContent={'center'}>
                        <img
                            width={150}
                            srcSet={'https://yellow.radio/wp-content/uploads/2020/04/unnamed.png'}
                            src={'https://yellow.radio/wp-content/uploads/2020/04/unnamed.png'}
                            alt={'Spotify logo'}
                            loading="lazy"
                        />
                        <img
                            width={150}
                            srcSet={spotifylogo}
                            src={spotifylogo}
                            alt={'Spotify logo'}
                            loading="lazy"
                        />
                        <img
                            width={150}
                            srcSet={'https://upload.wikimedia.org/wikipedia/commons/c/cd/Wikidata_stamp.png'}
                            src={'https://upload.wikimedia.org/wikipedia/commons/c/cd/Wikidata_stamp.png'}
                            alt={'Wikidata stamp'}
                            loading="lazy"
                        />
                    </Stack>
                </>}
            />
        </Fragment>
    )
}

export default AboutDialog