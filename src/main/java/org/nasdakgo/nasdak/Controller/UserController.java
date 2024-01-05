package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.SNSService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
@Log4j2
public class UserController {

    private final UserService userService;
    private final CategoryService categoryService;
    private final SNSService snsService;
    private final ModelMapper modelMapper;
    @Value("${upload.file.profile}")
    private String uploadProfilePath;
    @Value("${download.file.profile}")
    private String downloadProfilePath;

    @RequestMapping("signUp")
    public UserDto signUp(@RequestBody UserDto userDto) throws Exception {
        User user = userService.signUp(toUser(userDto));
        categoryService.saveDefaultCategory(user);
        return toUserDto(user);
    }

    @RequestMapping("existUserId")
    public int existUserId(@RequestBody UserDto userDto){
        User byId = userService.searchUserId(toUser(userDto));
        return (byId == null) ? 0 : 1 ;
    }

    @RequestMapping("existAuth")
    public int existAuth(@RequestBody UserDto userDto){
        User byId = userService.findId(toUser(userDto));
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
    public void deleteUser(@RequestBody UserDto userDto){
        User user = toUser(userDto);
        if(userDto.getSnsType()!=null){
            snsService.deleteUser(user);
        }
        userService.deleteUser(user);
    }

    @RequestMapping("logout")
    public void logout(){

    }
    
    @RequestMapping("uploadProfile")
    public String uploadProfile(@RequestParam(name = "userNo") Long userNo,
                              @ModelAttribute(name = "mf")MultipartFile mf) throws Exception {
        String fileName = FileUtil.saveFileList(mf, uploadProfilePath);
        User user = User.builder()
                .userNo(userNo)
                .profile(fileName)
                .build();
        userService.uploadProfile(user);
        return downloadProfilePath+fileName;
    }

    @RequestMapping("updateProfile")
    public String updateProfile(@RequestParam(name = "userNo") Long userNo,
                              @RequestParam(name = "before") String before,
                              @ModelAttribute(name = "mf")MultipartFile mf) throws Exception {
        boolean b = this.removeProfile(before);
        log.info("파일삭제 : "+b);
        return this.uploadProfile(userNo, mf);
    }

    @RequestMapping("deleteProfile")
    public void deleteProfile(@RequestBody UserDto userDto) {
        User user = toUser(userDto);
        boolean b = this.removeProfile(user.getProfile());
        log.info("파일삭제 : "+b);
        user.setProfile(null);
        userService.uploadProfile(user);
    }

    private boolean removeProfile(String profile) {
        int index = profile.lastIndexOf('/');
        if(index!=-1){
            profile = profile.substring(index);
            return FileUtil.deleteFile(profile, uploadProfilePath);
        }
        return false;
    }

    private User toUser(UserDto userDto){
        return modelMapper.map(userDto, User.class);
    }

    private UserDto toUserDto(User user){
        if(user.getProfile()!=null){
            user.setProfile(downloadProfilePath+user.getProfile());
        }
        return modelMapper.map(user, UserDto.class);
    }

}
