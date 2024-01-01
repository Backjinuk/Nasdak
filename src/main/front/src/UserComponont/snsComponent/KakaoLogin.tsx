import { Box, CircularProgress } from "@mui/material";
import axios from "axios";

export default function KakaoLogin(){
    const data = window.location.href.split('?')[1]
    let map = {
        code : '',
        state : '',
    };
    data.split('&').forEach(item => {
        const [key,val] = item.split('=')
        map = {...map, [key]:val}
    })
    axios.post('/api/sns/kakao/getToken',JSON.stringify(map),{
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then(res=>{
        console.log(res.data)
        window.opener.Kakao.Auth.setAccessToken(res.data.accessToken)
        window.opener.snsLoginNavigate(res.data.userNo, res.data.snsType, res.data.accessToken);
        window.close();
    })

    return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>)
}