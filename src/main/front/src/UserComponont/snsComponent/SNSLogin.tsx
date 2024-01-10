import { Box, CircularProgress } from "@mui/material";
import axios from "axios"

export default function SNSLogin(){
    const data = window.location.href.split('?')[1]
    const state = JSON.parse(window.opener.sessionStorage.getItem('snsState'))
    const userNo = window.opener.sessionStorage.getItem('userNo')
    const snsType = state.snsType
    const action = state.action
    let map = {
        code : '',
        state : '',
        snsType : snsType,
        userNo : userNo
    };
    data.split('&').forEach(item => {
        const [key,val] = item.split('=')
        map = {...map, [key]:val}
    })
    
    switch(action){
        case 'login':
            login(map)
            break;
        case 'connect':
            connect(map)
            break;
    }

    return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>)
}

function login(map:any){
    axios.post('/api/sns/login',JSON.stringify(map),{
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then(res=>{
        window.opener.snsLoginNavigate(res.data.userNo, res.data.snsType, res.data.accessToken);
        if(res.data.snsType==='KAKAO'){
            window.opener.Kakao.Auth.setAccessToken(res.data.accessToken)
        }
        window.close();
    })
}

async function connect(map:any){
    const snsSet = window.opener.snsSet
    const setSnsSet = (set:any)=>{window.opener.setSnsSet(set)}
    const res = await axios.post('/api/sns/connect',JSON.stringify(map),{
        headers:{
            'Content-Type' : 'application/json'
        }
    })
    if(res.data===0){
        const nextSnsSet = {
            ...snsSet,
            [map.snsType] : true
        }
        setSnsSet(nextSnsSet)
    }else{
        window.opener.sessionStorage.setItem('dbSnsNo', res.data)
        window.opener.handleChangeSnsDialogOpen()
    }
    window.close();
}