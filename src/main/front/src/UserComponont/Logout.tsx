import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const navigate = useNavigate()

    function handleClick(){
        sessionStorage.clear()
        navigate("/")
    }

    return (
        <div style={{
height: "150px", display: "flex", alignItems: "center", justifyContent: "left", marginRight: "3%"
}}>
        <Button variant="outlined" onClick={()=>{handleClick()}}>로그아웃</Button>
        </div>)
}