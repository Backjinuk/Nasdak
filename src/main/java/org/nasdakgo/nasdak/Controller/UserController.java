package org.nasdakgo.nasdak.Controller;

import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/")
public class UserController {


    UserService userService;
    ModelMapper modelMapper;

    @Autowired
    public  UserController(UserService userService, ModelMapper modelMapper){
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @RequestMapping("test")
    public String test(){
        return "react hello";
    }

    @RequestMapping("findUserId")
    public int findUserId(@RequestBody UserDto usersDto){
        User byId = userService.searchUserId(usersDto.getUserId());
        return (byId == null) ? 0 : 1 ;
    }

    @RequestMapping("userLogin")
    public UserDto userLogin(@RequestBody UserDto usersDto){

        User users = userService.userLogin(modelMapper.map(usersDto, User.class));

        return modelMapper.map(users, UserDto.class);
    }

    @RequestMapping("userJoin")
    public UserDto userJoin(@RequestBody UserDto usersDto){
        User users = userService.userJoin(modelMapper.map(usersDto, User.class));

        return modelMapper.map(users, UserDto.class);
    }

}
