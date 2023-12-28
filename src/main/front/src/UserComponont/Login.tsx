import Swal from "sweetalert2";
import {useState} from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Join from "./Join";
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel } from "@mui/material";
import { getCookie, setCookie } from "Cookies";



export default function Login() {

    const [id, setId] = useState(getCookie('userId'));
    const [pwd, setPwd] = useState('');
    const [open, setOpen] = useState(false);
    const [remember, setRemember] = useState(Boolean(getCookie('remember')===null?false:getCookie('remember')));
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const sty: any = {
        borderRadius: "5px",
        border: "1px solid rgba(0, 0, 0, 0.16)",
        width: "500px",
        alignContent: "center",
        padding: "15px",
        position: "absolute",
        top: "50%",
        left: "18%",
        transform: "translate(50%, -50%)"
    };

    const LoginMember = () => {
        axios.post("/api/user/login", JSON.stringify({
            userId: id,
            password: pwd
        }), {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {

            if (res.data.userId !== '') {
                Swal.fire({
                    icon: 'success',
                    title: '로그인 되었습니다.',
                });

                if(remember){
                    setCookie("userId", id, {maxAge:60*60*24*30})
                }
                sessionStorage.setItem("userId", id);
                sessionStorage.setItem("userNo", res.data.userNo);

                //const accessToken = res.data;
                // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken.jwt}`;
                // document.cookie = `jwtCookie=Bearer ${accessToken.jwt}`;
                //
                navigate("/Ledger");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '아이디 혹은 비밀번호를 다시 확인해주세요.'
                })
                return;
            }
        })
    }

    function handleRemember(e:any){
        setRemember(e.target.checked)
        setCookie("remember", e.target.checked, {maxAge:60*60*24*30})
    }

    return (
        <>
            <div className={"text-center shadow-lg"} style={sty}>
                <div className="form-signin w-100 m-auto">
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" value={id}
                               placeholder="name@example.com"
                               onChange={(e) => setId(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control pwd" id="floatingPassword" value={pwd}
                               placeholder="Password"
                               onChange={(e) => setPwd(e.target.value)}
                               onKeyDown={(e) => {if(e.key  === 'Enter') {LoginMember(); }}}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="checkbox mb-3">
                        <FormControlLabel
                        control={<Checkbox value="remember" checked={remember} onChange={(e)=>{handleRemember(e)}} color="primary" />}
                        label="Remember me"
                        />
                    </div>
                    <Button className="w-100 btn btn-lg btn-primary mb-2" type="submit" onClick={LoginMember}>로그인
                    </Button>
                    <Button className="w-100 btn btn-lg btn-info" onClick={handleOpen}>회원 가입
                    </Button>
                    <Button className="w-100 btn btn-lg btn-primary mb-2" onClick={()=>{navigate('/findId')}}>아이디 찾기
                    </Button>
                </div>

            </div>

            < Join open={open} handleClose={handleClose} />
        </>


    )
}