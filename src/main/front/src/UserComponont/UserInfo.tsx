import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Avatar, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Switch, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material";
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logout from 'UserComponont/js/logout';
import Join from './Join';
import { handleNaverLogin, handleKakaoLogin, setSnsState } from 'UserComponont/js/snsLogin'

declare global {
    interface Window {
        snsSet?: any,
        setSnsSet? : any,
        handleChangeSnsDialogOpen? : any
    }
  }

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
    const [snsSet, setSnsSet] = useState({...initialSnsSet})
    const [uploadFile, setUploadFile] = useState<any>();
    const [isEdit, setIsEdit] = useState(false)
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [signUpOpen, setSignUpOpen] = useState(false)
    const handleSignUpOpen = () => setSignUpOpen(true)
    const handleSignUpClose = () => setSignUpOpen(false)
    const [disconnectSnsDialogOpen, setDisconnectSnsDialogOpen] = useState(false)
    const handleDisconnectSnsDialogOpen = (sns:string) => {
        setDisconnectSnsDialogOpen(true)
        setSelectedSns(sns)
    }
    const handleDisconnectSnsDialogClose = () => setDisconnectSnsDialogOpen(false)
    const [changeSnsDialogOpen, setChangeSnsDialogOpen] = useState(false)
    const handleChangeSnsDialogOpen = () => setChangeSnsDialogOpen(true)
    const handleChangeSnsDialogClose = () => setChangeSnsDialogOpen(false)
    const [selectedSns, setSelectedSns] = useState('')
    const isSNS = user.userId===null
    window.snsSet = snsSet
    window.setSnsSet = (set:any)=>{setSnsSet(set)}
    window.handleChangeSnsDialogOpen = handleChangeSnsDialogOpen

    useEffect(()=>{setSnsState('connect')},[])
    useEffect(()=>{
        getUserInfo(setSnsSet, setUser, setBackup)
    },[signUpOpen, changeSnsDialogOpen])

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
                    updateUserProfile(nextUser)
                //프로필 삭제 시
                }else if(user.profile===''){
                    deleteUserProfile()
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

    function updateUserProfile(nextUser:any){
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
    }

    function deleteUserProfile(){
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

    async function deleteUser(){
        for (const sns of Object.entries(snsSet)) {
          if (sns[1]) {
            const res = await disconnectSns(sns[0])
            if (res===false) {
              return;
            }
          }
        }

        axios.post("/api/user/deleteUser", JSON.stringify({
            userNo : sessionStorage.getItem('userNo'),
            snsType : sessionStorage.getItem('snsType')
        }), {
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res=>{
            logout()
            navigate("/")
        })
    }

    function handleDeleteProfile(){
        const nextUser = {
            ...user,
            profile : ''
        }
        setUser(nextUser)
    }

    function connectSns(snsType:string){
        setSelectedSns(snsType)
        switch(snsType){
            case 'NAVER':
                handleNaverLogin()
                break;
            case 'KAKAO':
                handleKakaoLogin()
                break;
            case 'GOOGLE':
                break;
        }
    }

    async function disconnectSns(snsType:string){
        const res = await axios.post("/api/sns/disconnect",JSON.stringify({
            userNo : sessionStorage.getItem('userNo'),
            accessToken : sessionStorage.getItem('accessToken'),
            snsType : snsType
        }),{
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        if(res.data){
            setSnsSet({
                ...snsSet,
                [snsType] : false
            })
            handleDisconnectSnsDialogClose()
            return true
        }else{
            handleKakaoLogin()
            return false
        }
    }

    const snsSignUp = (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt:3 }}>
            <Typography variant="body1" component="body" sx={{mr:1}}>
                {sessionStorage.getItem('snsType')}로 로그인한 계정입니다.
            </Typography>
            <Button
                variant="contained"
                onClick={handleSignUpOpen}>
                회원 가입
            </Button>
        </Box>
    )

    const userInfo = (
        <>
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
                value={user.email===null?'':user.email}
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
                value={user.phone===null?'':user.phone}
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
        </>
    )

    const userAvatar = (
        <Box>
            <Badge
            badgeContent={'X'}
            color="error"
            sx={{cursor:'pointer'}}
            onClick={()=>{handleDeleteProfile()}}
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
    )

    const integrationStyle = {
        cursor: 'pointer',
        borderRadius: '30%',
        width: 40,
        height: 40
    }
    const snsConnection = (
        <Stack spacing={1} >
            <div style={{marginLeft:'auto', marginRight:'auto'}}>- sns 연동 -</div>
            <Stack direction='row' spacing={2} justifyContent='center'>
                {Object.entries(snsSet).filter(sns => sns[0]!=='GOOGLE').map(sns=>(
                <Tooltip key={sns[0]} title={sns[1]?'연동해제':'연동하기'} arrow>
                    <Badge badgeContent={sns[1]?'OK':'X'} color={sns[1]?'success':'error'}>
                        <img
                            style={integrationStyle}
                            src={snsImageLink[sns[0]]}
                            alt={sns[0].toLowerCase()}
                            onClick={sns[1]?
                                ()=>{handleDisconnectSnsDialogOpen(sns[0])}
                                :()=>{connectSns(sns[0])}
                                } />
                    </Badge>
                </Tooltip>
                ))}
            </Stack>
        </Stack>
    )

    const buttonGroup = (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            {isEdit?(<>
                <Button
                    variant="contained"
                    onClick={()=>{handleEdit(false)}}
                    sx={{ ml:1 }}
                >
                    취소
                </Button>
                <Button
                    variant="contained"
                    onClick={()=>{handleEdit(true)}}
                    sx={{ ml:1 }}
                >
                    완료
                </Button>
            </>):(
                <Button
                variant="contained"
                onClick={()=>{setIsEdit(true)}}
                sx={{ ml:1 }}
                >
                수정
            </Button>
            )}
            <Button
                variant="contained"
                onClick={()=>{handleClickOpen()}}
                sx={{ ml:1 }}
                >
                회원탈퇴
            </Button>
        </Box>
    )
    
    const infoBox = (
        <Box sx={{ mt: 3, width:'100%' }}>
            <Grid container spacing={2}>
                {isSNS?'':userInfo}
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
    )

  return (
    <Fragment>
        <CssBaseline />
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    {userAvatar}
                    <Typography component="h1" variant="h5">
                        내 정보 조회
                    </Typography>
                    {infoBox}
                </Box>
                <Fragment>
                    {isSNS?snsSignUp:''}
                    {buttonGroup}
                    {isSNS?'':snsConnection}
                </Fragment>
            </Paper>
            <Copyright navigate={navigate} />
        </Container>
        <DeleteUserDialog open={open} handleClose={handleClose} deleteUser={deleteUser} />
        <DisconnectSnsDialog 
            open={disconnectSnsDialogOpen}
            handleClose={handleDisconnectSnsDialogClose}
            snsType={selectedSns}
            disconnectSns={disconnectSns} />
        <ChangeSnsDialog open={changeSnsDialogOpen} handleClose={handleChangeSnsDialogClose} snsType={selectedSns} />
        <Join open={signUpOpen} handleClose={handleSignUpClose} userNo={user.userNo}/>
    </Fragment>
  );
}

function DeleteUserDialog(props : any){
    const open = props.open
    const handleClose = ()=>{props.handleClose()}
    const deleteUser = ()=>{props.deleteUser()}

    return (
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
    )
}

function DisconnectSnsDialog(props : any){
    const open = props.open
    const handleClose = ()=>{props.handleClose()}
    const snsType = String(props.snsType)
    const disconnectSns = (snsType:string)=>{props.disconnectSns(snsType)}

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"계정 연동 해제"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {snsToKorean[snsType]+" 계정의 연동을 해제하시겠습니까?"}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button onClick={()=>{disconnectSns(snsType)}}>
                연동 해제
            </Button>
            </DialogActions>
        </Dialog>
    )
}

function ChangeSnsDialog(props : any){
    const open = props.open
    const handleClose = ()=>{props.handleClose()}
    const snsType = String(props.snsType)
    function changeSnsUser(){
        const data = {
            userNo : sessionStorage.getItem('userNo'),
            snsNo : sessionStorage.getItem('dbSnsNo')
        }
        axios.post('/api/sns/changeConnection', JSON.stringify(data),{
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res=>{
            sessionStorage.removeItem('dbSnsNo')
            handleClose()
        })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"이미 연동된 계정이 있습니다."}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                해당 계정으로 연동 정보를 변경하시겠습니까?
            </DialogContentText>
            <DialogContentText id="alert-dialog-description" >
                {snsToKorean[snsType]} 로그인을 통해 원래 계정으로 접속하지 못하게 됩니다.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button id='change' onClick={changeSnsUser} autoFocus>
                변경
            </Button>
            </DialogActions>
        </Dialog>
    )
}

function getUserInfo(setSnsSet:any, setUser:any, setBackup:any){
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
        let nextSnsSet = {...initialSnsSet}
        data.snsDtoList.forEach((sns:any) => {
            nextSnsSet = {
                ...nextSnsSet,
                [sns.snsType] : true
            }
        })
        setSnsSet(nextSnsSet)
        setUser({...parseUser})
        setBackup({...parseUser})
    })
}

const snsImageLink = {
    KAKAO : '/image/loginImage/kakao_login_round.png',
    NAVER : '/image/loginImage/btnG_아이콘사각.png',
    GOOGLE : ''
} as {[key : string] : string}

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

const initialSnsSet = {
    NAVER : false,
    KAKAO : false,
    GOOGLE : false
} as {[key : string] : boolean}

const snsToKorean = {
    KAKAO : '카카오',
    NAVER : '네이버',
    GOOGLE : '구글'
} as {[key : string] : string}

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