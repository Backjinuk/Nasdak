import logout from "UserComponont/js/logout"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function KakaoLogout(){
    const navigate = useNavigate()
    useEffect(()=>{
        window.Kakao.Auth.logout()
        logout()
        navigate('/')
    })
    return (<></>)
}