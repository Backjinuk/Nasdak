import { Button } from "@mui/material";
import logout from "logout";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const navigate = useNavigate()

    const snsType = sessionStorage.getItem('snsType')
    function handleClick(){
        if(snsType==='KAKAO'){
            const redirect_uri = encodeURI('http://localhost:3000/kakaoLogout')
            let uri = 'https://kauth.kakao.com/oauth/logout'
            uri += '?client_id='+process.env.REACT_APP_KAKAO_LOGIN_JAVASCRIPT_KEY
            uri += '&logout_redirect_uri='+redirect_uri
            uri += '&state='+sessionStorage.getItem('state')
            window.location.href = uri
        }else{
            logout()
            navigate("/")
        }
    }

    return (
        <div style={{
height: "150px", display: "flex", alignItems: "center", justifyContent: "left", marginRight: "3%"
}}>
        <Button variant="outlined" onClick={()=>{handleClick()}}>로그아웃</Button>
        </div>)
}