import Swal from "sweetalert2";
import {ChangeEvent, useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";
import Join from "./Join";



export default function Login() {

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

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
        axios.post("/api/user/userLogin", JSON.stringify({
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
                               onKeyPress={(e) => {if(e.key  === 'Enter') {LoginMember(); }}}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" value="remember-me"/> Remember me
                        </label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary mb-2" type="submit" onClick={LoginMember}>로그인
                    </button>
                    <button className="w-100 btn btn-lg btn-info" data-bs-toggle="modal"
                            data-bs-target="#addMemeber">회원 가입
                    </button>

                </div>

            </div>

            < Join/>
        </>


    )
}