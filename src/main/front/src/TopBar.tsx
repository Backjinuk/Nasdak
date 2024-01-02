import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CreateLeger from "./LedgerComponont/CreateLeger";
import {useNavigate} from "react-router-dom";
import CategoryList from "./categoryComponent/CategortList";
import UserInfoButton from "./UserComponont/UserInfoButton";
import Logout from "./UserComponont/Logout";

export default function ButtonAppBar({ChangeEvent, categoryList} : any) {
    const navigate  = useNavigate();

    return (

        <Box sx={{flexGrow: 1, my: 2}}>
                <AppBar position="static">

                        <Toolbar variant="dense" sx={{ height: '60px' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>

                            <CreateLeger ChangeEvent={ChangeEvent} categoryList={categoryList}/>

                            <Button sx={{color: '#fff'}} variant="outlined" onClick={() => navigate("/MapLocation")}>지도 모아보기</Button>

                            <Button sx={{color: '#fff'}} variant="outlined" onClick={() => navigate("/calender")}>달력으로 보기</Button>

                            <CategoryList changeEvent={ChangeEvent} categoryList={categoryList}/>

                            <UserInfoButton/>

                            <Logout/>

                        </Toolbar>

                </AppBar>

        </Box>

)
    ;
}