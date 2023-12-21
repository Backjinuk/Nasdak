package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
public class UserController {

    private final UserService userService;
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @RequestMapping("signUp")
    public UserDto signUp(@RequestBody UserDto userDto){
        User user = userService.signUp(toUser(userDto));
        categoryService.saveDefaultCategory(user);
        return toUserDto(user);
    }

    @RequestMapping("findUserId")
    public int findUserId(@RequestBody UserDto userDto){
        User byId = userService.searchUserId(toUser(userDto));
        return (byId == null) ? 0 : 1 ;
    }

    @RequestMapping("login")
    public UserDto login(@RequestBody UserDto userDto){

        User user = userService.login(toUser(userDto));

        return toUserDto(user);
    }

    @RequestMapping("findId")
    public String findId(@RequestBody UserDto userDto){
        return userService.findId(toUser(userDto)).getUserId();
    }

    @RequestMapping("findPassword")
    public long findPassword(@RequestBody UserDto userDto){
        return userService.findPassword(toUser(userDto)).getUserNo();
    }

    @RequestMapping("updatePassword")
    public void updatePassword(@RequestBody UserDto userDto){
        userService.updatePassword(toUser(userDto));
    }

    @RequestMapping("getUserInfo")
    public UserDto getUserInfo(@RequestBody UserDto userDto){
        User user = userService.getUserInfo(toUser(userDto));
        return toUserDto(user);
    }

    @RequestMapping("updateUserInfo")
    public void updateUserInfo(@RequestBody UserDto userDto){
        userService.updateUserInfo(toUser(userDto));
    }

    @RequestMapping("updateAuth")
    public void updateAuth(@RequestBody UserDto userDto){
        userService.updateAuth(toUser(userDto));
    }

    @RequestMapping("deleteUser")
    public void deleteUser(){

    }

    @RequestMapping("logout")
    public void logout(){

    }

    private User toUser(UserDto userDto){
        return modelMapper.map(userDto, User.class);
    }

    private UserDto toUserDto(User user){
        return modelMapper.map(user, UserDto.class);
    }

}
