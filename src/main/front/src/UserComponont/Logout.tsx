import { Button } from "@mui/material";
import logout from "UserComponont/js/logout";
import { useAppDispatch } from "app/hooks";
import { dropCategories } from "app/slices/categoriesSlice";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const snsType = sessionStorage.getItem('snsType')
    function handleClick(){
        if(snsType==='KAKAO'){
            window.Kakao.Auth.setAccessToken(sessionStorage.getItem('accessToken'))
            window.Kakao.Auth.logout()
            logout()
            dispatch(dropCategories())
            navigate("/")
        }else{
            logout()
            dispatch(dropCategories())
            navigate("/")
        }
    }

    return (
        <Button sx={{ color: '#fff' }} variant="outlined" onClick={()=>{handleClick()}}>로그아웃</Button>
        )
}