import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function UserInfoButton(){
    const navigate = useNavigate()

    function handleClick(){
        navigate("/userInfo")
    }
    
    return (
    <div style={{
height: "150px", display: "flex", alignItems: "center", justifyContent: "left", marginRight: "3%"
        }}>
    <Button sx={{ color: '#fff' }} variant="outlined" onClick={()=>{handleClick()}}>내 정보 조회</Button>
    </div>)
}