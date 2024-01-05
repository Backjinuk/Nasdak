import { Button } from "@mui/material";
import logout from "logout";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const navigate = useNavigate()

    const snsType = sessionStorage.getItem('snsType')
    function handleClick(){
        if(snsType==='KAKAO'){
            const kakaoApiKey = process.env.REACT_APP_KAKAO_LOGIN_JAVASCRIPT_KEY
            const redirect_uri = encodeURI('http://localhost:3000/kakaoLogout')
            let uri = 'https://kauth.kakao.com/oauth/logout'
            uri += '?client_id='+kakaoApiKey
            uri += '&logout_redirect_uri='+redirect_uri
            uri += '&state='+sessionStorage.getItem('state')
            window.location.href = uri
        }else{
            logout()
            navigate("/")
        }
    }

    return (
        <Button sx={{ color: '#fff' }} variant="outlined" onClick={()=>{handleClick()}}>로그아웃</Button>
        )
}