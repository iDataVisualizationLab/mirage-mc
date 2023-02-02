import {Avatar, Card, CardContent, Divider, Link, Typography} from "@mui/material";
import moment from "moment/moment";
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function DetailCard ({data}){
    return <Card>
        <CardContent >
            <Typography component="div" variant="h2">
                {data.station}
            </Typography>
            <Typography component="div" variant="subtitle1" color="text.secondary">
                {data.station_description}
            </Typography>

            <table style={{width:'100%'}}>
                <colgroup><col style={{width:130}}/><col/></colgroup>
                <tr><td>Station Genre</td><td>{data.station_genre}</td></tr>
                <tr><td>Station URL</td><td><Link href={data.station_url} target={'_blank'} color={'secondary'}>{data.station_url}</Link></td></tr>
                <tr><td>Location</td><td><Link target={'_blank'} color={'secondary'} href={`https://maps.google.com/?q=${data.lat},${data.long}`}><MapIcon/>{data.city}, {data.country}</Link></td></tr>
                <tr><td>Radio Garden URL</td><td><Link href={data.url} target={'_blank'} color={'secondary'}>{data.station_url}</Link></td></tr>
                <tr><td colspan="2"><Divider sx={{mt:2,mb:2}}/></td></tr>
                <tr><td>Artist</td><td  style={{display:'flex'}}><Avatar  aria-label="recipe" sx={{mr:1}}>{data.stream_artist[0]}</Avatar>
                    <div>
                        <Typography variant="h5" color={'text.primary'}>{data.stream_artist}</Typography>
                        <Typography variant="subtitle2">NA</Typography>
                    </div></td></tr>
                <tr><td>Song</td><td>{data.stream_song}</td></tr>
                <tr><td>Time Monitored</td><td>{moment(data.time_station).format('LLL')}</td></tr>
            </table>

            {/*<Typography component="div" variant="subtitle1" color="text.secondary">*/}
            {/*    Time Monitored : {moment(data.time_station).format('LLL')}*/}
            {/*</Typography>*/}
        </CardContent>
    </Card>
}
export default DetailCard