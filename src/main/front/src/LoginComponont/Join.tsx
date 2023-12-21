import {ChangeEvent, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


export default function Join({open, handleClose} : {open : boolean, handleClose : any}) {
    const [sid, setSid] = useState('');
    const [spwd, setSpwd] = useState('');
    const [emile, setEmile] = useState('');
    const [phone, setPhone] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [addMemberbtn, setAddMemberBtn] = useState(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
      };

    function LoginCheck(e: ChangeEvent<HTMLInputElement>) {
        axios.post("/api/user/findUserId", JSON.stringify(
            {"userId": e.target.value}
        ), {
            headers: {
                "Content-Type": "application/json"            }
        }).then((res) => {
            if (res.data > 0) {
                setIdSearch("이미 사용중인 아이디 입니다")
                setAddMemberBtn(true);
            } else {
                setIdSearch("사용 가능한 아이디 입니다")
                setAddMemberBtn(false);
            }
        })
        setSid(e.target.value)
    }

    function addMember() {
        let data = {
            userId: sid,
            password: spwd,
            email: emile,
            phone: phone
        } as {[key : string] : string};

        const fields = ['userId', 'password', 'email', 'phone'];

        const missingField = fields.find(field => !data[field]);

        if (missingField) {
            swalert(
                missingField === 'userId' ? '아이디' :
                    missingField === 'password' ? '비밀번호' :
                    missingField === 'email' ? '이메일' : '전화번호'
            );
            return false;
        }

        axios.post(`/api/user/signUp`, JSON.stringify(data), {
            headers: {
                "Content-Type": `application/json`,
            },
        }).then(res => {

            Swal.fire({
                icon: 'success',
                title: '회원가입 되었습니다..',
                timer : 2000
            }).then(()=>{
                handleClose();
            })
        })
    }

    function swalert(str : string){
        Swal.fire({
            icon: 'error',
            title: str+'입력하여 주세요.',
        })
    }





    return (
        <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{zIndex:1000}}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">회원가입</h1>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form name={"addMemeber"}>
                        <div className="modal-body">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control setId" id="floatingId" value={sid}
                                    onChange={(e) => LoginCheck(e)}
                                    placeholder="name@example.com"/>
                                {idSearch === '' ?
                                    <label htmlFor="floatingId">아이디</label> :
                                    <label style={{color: "red"}}>{idSearch}</label>
                                }

                            </div>

                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingSpassword" value={spwd}
                                    onChange={(e) => {
                                        setSpwd(e.target.value)
                                    }}
                                    placeholder="Password"/>
                                <label htmlFor="floatingSpassword">비밀번호</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingEmile" value={emile}
                                    onChange={(e) => {
                                        setEmile(e.target.value)
                                    }}
                                    placeholder="Password"/>
                                <label htmlFor="floatingEmile">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" id="floatingPhone" value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                    }}
                                    placeholder="Password"/>
                                <label htmlFor="floatingPhone">Phone</label>
                            </div>
                        </div>
                    </form>
                    <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button type="button" className="btn btn-secondary" onClick={handleClose}> 취소
                        </Button>

                        <Button type="button" onClick={() => addMember()}
                                className={!addMemberbtn ? "btn btn-info" : "btn btn-danger disabled"}>회원가입
                        </Button>
                    </Box>
                </Typography>
            </Box>
        </Modal>
    )
}