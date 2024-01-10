import { Button } from "@mui/material";
import logout from "UserComponont/js/logout";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const navigate = useNavigate()

    const snsType = sessionStorage.getItem('snsType')
    function handleClick(){
        if(snsType==='KAKAO'){
            window.Kakao.Auth.setAccessToken(sessionStorage.getItem('accessToken'))
            window.Kakao.Auth.logout()
            logout()
            navigate("/")
        }else{
            logout()
            navigate("/")
        }
    }

    return (
        <Button sx={{ color: '#fff' }} variant="outlined" onClick={()=>{handleClick()}}>로그아웃</Button>
        )
}