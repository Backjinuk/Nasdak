import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';

const steps = ['아이디 찾기', '아이디 확인', '비밀번호 변경', '완료']

export default function FindUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [auth, setAuth] = useState(initialAuth);
  const [radio, setRadio] = useState('email');
  const [userId, setUserId] = useState('')
  const [userNo, setUserNo] = useState('')
  const handleNext = ()=>{setStep(step+1)}

  function getStep(step : number){
    switch(step){
      case 0:
        return <StepOne auth={auth} setAuth={setAuth} radio={radio} setRadio={setRadio} handleNext={handleNext} setUserId={setUserId} />;
      case 1:
        return <StepTwo userId={userId} auth={auth} radio={radio} handleNext={handleNext} navigate={navigate} setUserNo={setUserNo}/>;
      case 2:
        return <StepThree userNo={userNo} handleNext={handleNext} />;
      case 3:
        return <StepFour navigate={navigate} />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <React.Fragment>
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
          <Typography component="h1" variant="h4" align="center">
            {steps[step]}
          </Typography>
          {getStep(step)}
        </Paper>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}

function StepOne(props : any){
  const auth = props.auth
  const radio = props.radio
  const setAuth = (data:any) => {props.setAuth(data)}
  const setRadio = (e:any)=>{props.setRadio(e)}
  const handleNext = ()=>{props.handleNext()}
  const setUserId = (userId:string)=>{props.setUserId(userId)}

  function handleFind(){
    let data;
    if(radio==='email'){
      data = {email : auth.email}
    }else{
      data = {phone : auth.phone}
    }
    axios.post("/api/user/findId", JSON.stringify(data),{
      headers:{
        'Content-Type' : 'application/json'
      }
    }).then(res=>{
      setUserId(res.data)
      handleNext()
    })
  }

  return (<>
    <FormControl>
      <RadioGroup
        defaultValue="email"
        name="radio-buttons-group"
        row = {true}
        value={radio}
        onChange={(e)=>{setRadio(e.target.value); setAuth(initialAuth)}}
        >
        <FormControlLabel value="email" control={<Radio />} label="이메일로 찾기" />
        <FormControlLabel value="phone" control={<Radio />} label="휴대폰으로 찾기" />
      </RadioGroup>
    </FormControl>
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {radio==='email'?(
          <Grid item xs={12}>
            <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={auth.email}
            onChange={e=>{setAuth({
              ...auth,
              [e.target.name] : e.target.value
            })}}
            />
          </Grid>
        ):(
          <Grid item xs={12}>
              <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              value={auth.phone}
              onChange={e=>{setAuth({
                ...auth,
                [e.target.name] : e.target.value
              })}}
              />
          </Grid>
        )}
      </Grid>
    </Box>
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={()=>{handleFind()}}
          sx={{ mt: 3, ml: 1 }}
        >
          검색
        </Button>
      </Box>
    </React.Fragment>
  </>)
}

function StepTwo(props : any){
  const userId = props.userId
  const navigate = props.navigate
  const radio = props.radio
  const auth = props.auth
  const setUserNo = (val:any)=>{props.setUserNo(val)}
  const handleNext = ()=>{
    let data;
    if(radio==='email'){
      data = {email : auth.email}
    }else{
      data = {phone : auth.phone}
    }
    axios.post("/api/user/findPassword", JSON.stringify({
      ...data, userId : userId
    }),{
      headers:{
        'Content-Type' : 'application/json'
      }
    }).then(res=>{
      setUserNo(res.data)
      props.handleNext()
    })
  }
  return (<>
    <React.Fragment>
      <Typography component="h1" variant="h6" align="center">
        <p></p>
        아이디는 '{userId}'입니다.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={()=>{handleNext()}}
          sx={{ mt: 3, ml: 1 }}
        >
          비밀번호 변경하기
        </Button>
        <Button
          variant="contained"
          onClick={()=>{navigate('/')}}
          sx={{ mt: 3, ml: 1 }}
        >
          로그인하기
        </Button>
      </Box>
    </React.Fragment>
  </>)
}

function StepThree(props : any){
  const userNo = props.userNo
  const [password, setPassword] = useState('')
  const handleNext = ()=>{props.handleNext()}
  
  function handleChange(){
    const data = {
      userNo : userNo,
      password : password
    }
    axios.post("/api/user/updatePassword", JSON.stringify(data),{
      headers:{
        'Content-Type' : 'application/json'
      }
    }).then(res=>{
      handleNext()
    })
  }

  return (<>
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
              fullWidth
              id="password"
              label="Password"
              name="password"
              value={password}
              onChange={e=>{setPassword(e.target.value)}}
              />
          </Grid>
      </Grid>
    </Box>
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={()=>{handleChange()}}
          sx={{ mt: 3, ml: 1 }}
        >
          변경
        </Button>
      </Box>
    </React.Fragment>
  </>)
}

function StepFour(props : any){
  const navigate = props.navigate
  return (<>
    <React.Fragment>
      <Typography component="h1" variant="h6" align="center">
        <p></p>
        비밀번호가 변경되었습니다.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={()=>{navigate('/')}}
          sx={{ mt: 3, ml: 1 }}
        >
          로그인하기
        </Button>
      </Box>
    </React.Fragment>
  </>)
}

const initialAuth = {
  email : '',
  phone : ''
}

function Copyright() {
  const navigate = useNavigate();
return (
  <Typography variant="body2" color="text.secondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://localhost:3000/" onClick={e=>{e.preventDefault(); navigate('/')}}>
      Your Website
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);
}