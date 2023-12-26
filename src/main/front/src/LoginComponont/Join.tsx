import {ChangeEvent, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormGroup, Stack, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Join(props: any) {
    const open = props.open;
    const handleClose = ()=>{
        setSid('')
        setSpwd('')
        setEmile('')
        setPhone('')
        setIdSearch('')
        setUploadFile(undefined)
        setImgBase64([])
        setAddMemberBtn(false)
        props.handleClose()
    }
    const [sid, setSid] = useState('');
    const [spwd, setSpwd] = useState('');
    const [emile, setEmile] = useState('');
    const [phone, setPhone] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [uploadFile, setUploadFile] = useState<any>();
    const [imgBase64, setImgBase64] = useState<string[]>([]);
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
        const data = {
            userId: sid,
            password: spwd,
            email: emile,
            phone: phone,
        } as {[key : string] : string};

        const missingField = Object.keys(data).find(field => !data[field]);

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

            if(uploadFile!==undefined){
                let fd = new FormData()
                fd.append("mf",uploadFile)
                fd.append('userNo', res.data.userNo)
    
                axios.post('/api/user/uploadProfile', fd, {
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
            }

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
                <Typography id="modal-modal-title" variant="h6" component="h1">
                    회원가입
                </Typography>
                <Stack spacing={2}>
                    <Box>
                        <FormGroup>
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
                                <Button component="label" sx={{width:'100%'}} variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload file
                                    <VisuallyHiddenInput onChange={(e)=>{
                                        const files = e.target.files
                                        setImgBase64([])
                                        setUploadFile(undefined)
                                        if(files !== null && files[0] !== undefined){
                                            setUploadFile(files[0])
                                            let reader = new FileReader();
                                            reader.readAsDataURL(files[0]);
                                            reader.onloadend = () => {
                                                const base64 = reader.result;
                                                if (base64) {
                                                var base64Sub = base64.toString()
                                                   
                                                setImgBase64(imgBase64 => [...imgBase64, base64Sub]);
                                                }
                                              }
                                        }
                                    }} type="file" />
                                 </Button>
                                 {imgBase64.map((item, idx) => (
                                    <img src={item} alt={item} key={idx} style={{width:'100%'}}/>
                                 ))}
                            </div>
                        </FormGroup>
                    </Box>
                    <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                        <Button type="button" className="btn btn-secondary" onClick={handleClose}> 취소
                        </Button>

                        <Button type="button" onClick={() => addMember()}
                                className={!addMemberbtn ? "btn btn-info" : "btn btn-danger disabled"}>회원가입
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    )
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });