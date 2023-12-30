import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Avatar, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material";
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Copyright(props : any) {
    const navigate = props.navigate;
    return (
        <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/ledger" onClick={(e)=>{e.preventDefault(); navigate("/ledger")}}>
            Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
}

export default function UserInfo() {
    const navigate = useNavigate()
    const [user, setUser] = useState({...initialUser})
    const [backup, setBackup] = useState({...initialUser})
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [uploadFile, setUploadFile] = useState<any>();

    useEffect(()=>{
        axios.post("/api/user/getUserInfo", JSON.stringify({
            userNo : sessionStorage.getItem('userNo')
        }), {
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res=>{
            const data = res.data
            const parseUser = {
                userNo : data.userNo,
                userId : data.userId,
                password : data.password,
                email : data.email,
                phone : data.phone,
                profile : data.profile,
                sendKakaoTalk : data.sendKakaoTalk,
                sendWebPush : data.sendWebPush
            }
            setUser(parseUser)
            setBackup(parseUser)
        })
    },[])

    function handleChange(e:any){
        if(e.target.type==='checkbox'){
            setUser({
                ...user,
                [e.target.name] : e.target.checked
            })
        }else{
            setUser({
                ...user,
                [e.target.name] : e.target.value
            })
        }
    }

    function handleEdit(val : boolean){
        let nextUser = {...user}
        if(val){
            axios.post("/api/user/updateUserInfo", JSON.stringify(user),{
                headers:{
                    'Content-Type' : 'application/json'
                }
            }).then(res=>{
                //새로 등록시 업로드
                if(uploadFile!==undefined){
                    const fd = new FormData()
                    fd.append("mf", uploadFile)
                    fd.append("userNo", String(user.userNo))
                    fd.append("before", backup.profile)
                    axios.post("/api/user/updateProfile", fd, {
                        headers:{
                            'Content-Type' : 'multipart/form-data'
                        }
                    }).then(res=>{
                        nextUser.profile = res.data
                        setUser(nextUser)
                    })
                //프로필 삭제 시
                }else if(user.profile===''){
                    const data = {
                        userNo : sessionStorage.getItem('userNo'),
                        profile : backup.profile
                    }
                    axios.post("/api/user/deleteProfile", JSON.stringify(data),{
                        headers:{
                            'Content-Type' : 'application/json'
                        }
                    })
                }
            })
            setUploadFile(undefined)
            setBackup(nextUser)
        }else{
            setUploadFile(undefined)
            setUser({...backup})
        }
        setIsEdit(false);
    }

    function deleteUser(){
        axios.post("/api/user/deleteUser", JSON.stringify({
            userNo : sessionStorage.getItem('userNo')
        }), {
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res=>{
            if(sessionStorage.getItem('snsType')!==null){
                axios.post("/api/sns/"+String(sessionStorage.getItem('snsType')).toLowerCase()+"/delete",JSON.stringify({
                    userNo : sessionStorage.getItem('userNo'),
                    accessToken : sessionStorage.getItem('accessToken')
                }),{
                    headers:{
                        'Content-Type' : 'application/json'
                    }
                })
            }
            sessionStorage.removeItem('userNo')
            sessionStorage.removeItem('userId')
            sessionStorage.removeItem('snsType')
            sessionStorage.removeItem('accessToken')
            navigate("/")
        })
    }

    function deleteProfile(){
        const nextUser = {
            ...user,
            profile : ''
        }
        setUser(nextUser)
    }

  return (
    <Fragment>
        <CssBaseline />
        <AppBar
            position="absolute"
            color="default"
            elevation={0}
            sx={{
            position: 'relative',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
        >
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    Nasdak
                </Typography>
            </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Box>
                        <Badge
                        badgeContent={'X'}
                        color="error"
                        sx={{cursor:'pointer'}}
                        onClick={()=>{deleteProfile()}}
                        invisible={!isEdit||user.profile===null||user.profile===''}
                        >
                            <div style={{cursor:'default'}} onClick={e=>{e.stopPropagation()}}>
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    {user.profile===null||user.profile===''?(
                                        <SentimentSatisfiedAltIcon/>
                                    ):(
                                        <img src={user.profile} alt={user.profile} width={'100%'}/>
                                    )}
                                </Avatar>
                            </div>
                        </Badge>
                    </Box>
                    <Typography component="h1" variant="h5">
                        내 정보 조회
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                required
                                fullWidth
                                id="userId"
                                label="userId"
                                name="userId"
                                value={user.userId}
                                disabled={true}
                                onChange={(e)=>{handleChange(e)}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={user.email}
                                disabled={!isEdit}
                                onChange={(e)=>{handleChange(e)}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                id="phone"
                                label="Phone Number"
                                name="phone"
                                value={user.phone}
                                disabled={!isEdit}
                                onChange={(e)=>{handleChange(e)}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={user.password}
                                disabled={!isEdit}
                                onChange={(e)=>{handleChange(e)}}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                control={
                                    <Switch disabled={!isEdit} checked={user.sendKakaoTalk} onChange={(e)=>{handleChange(e)}} name="sendKakaoTalk" />
                                }
                                label="카카오톡 알림 전송"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                control={
                                    <Switch disabled={!isEdit} checked={user.sendWebPush} onChange={(e)=>{handleChange(e)}} name="sendWebPush" />
                                }
                                label="웹 푸시 알림"
                                />
                            </Grid>
                            {isEdit?(
                            <Grid item xs={12}>
                                <Button component="label" sx={{width:'100%'}} variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload file
                                    <VisuallyHiddenInput onChange={(e)=>{
                                        const files = e.target.files
                                        setUploadFile(undefined)
                                        if(files !== null && files[0] !== undefined){
                                            setUploadFile(files[0])
                                        }
                                    }} type="file" />
                                 </Button>
                            </Grid>):undefined}
                        </Grid>
                    </Box>
                </Box>
                <Fragment>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isEdit?(<>
                            <Button
                                variant="contained"
                                onClick={()=>{handleEdit(false)}}
                                sx={{ mt: 3, ml: 1 }}
                            >
                                취소
                            </Button>
                            <Button
                                variant="contained"
                                onClick={()=>{handleEdit(true)}}
                                sx={{ mt: 3, ml: 1 }}
                            >
                                완료
                            </Button>
                        </>):sessionStorage.getItem('snsType')===null?(
                            <Button
                            variant="contained"
                            onClick={()=>{setIsEdit(true)}}
                            sx={{ mt: 3, ml: 1 }}
                        >
                            수정
                        </Button>
                        ):(
                        <Button disabled sx={{ mt: 3, ml: 1 }}>sns는 변경안됨</Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={()=>{handleClickOpen()}}
                            sx={{ mt: 3, ml: 1 }}
                        >
                            회원탈퇴
                        </Button>
                    </Box>
                </Fragment>
            </Paper>
            <Copyright navigate={navigate} />
        </Container>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"정말 회원탈퇴하시겠습니까?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                계정을 복구할 수 없습니다.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button id='delete' onClick={deleteUser} autoFocus>
                확인
            </Button>
            </DialogActions>
        </Dialog>
    </Fragment>
  );
}

const initialUser = {
    userNo : sessionStorage.getItem('userNo'),
    userId : '',
    password : '',
    email : '',
    phone : '',
    profile : '',
    sendKakaoTalk : false,
    sendWebPush : false
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