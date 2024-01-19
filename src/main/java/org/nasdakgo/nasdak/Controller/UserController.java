package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.SNSDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
@Log4j2
public class UserController {

    private final UserService userService;
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @Value("${upload.file.profile}")
    private String uploadProfilePath;
    @Value("${download.file.profile}")
    private String downloadProfilePath;

    @RequestMapping("validateSignUpUser")
    public ResponseEntity<?> validateSignUpUser(@RequestBody UserDto userDto){
        User user = toUser(userDto);
        if(!userService.canUseUserId(user)) return new ResponseEntity<>("id",HttpStatus.INTERNAL_SERVER_ERROR);
        if(userService.findId(user)!=null) return new ResponseEntity<>("exist",HttpStatus.INTERNAL_SERVER_ERROR);
        userService.setTempUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping("signUp")
    public UserDto signUp(@RequestBody UserDto userDto) throws Exception {
        User user = userService.signUp(toUser(userDto));
        categoryService.saveDefaultCategory(user);
        return toUserDto(user);
    }

    @RequestMapping("updateSNSUser")
    public UserDto updateSNSUser(@RequestBody UserDto userDto){
        userService.updateSNSUser(toUser(userDto));
        return userDto;
    }

    @RequestMapping("canUseUserId")
    public boolean canUseUserId(@RequestBody UserDto userDto){
        return userService.canUseUserId(toUser(userDto));
    }

    @GetMapping("sendEmail/{email}")
    public void sendEmail(@PathVariable String email){
        userService.sendEmail(email);
    }

    @RequestMapping("verifyEmail")
    public boolean verifyEmail(@RequestBody Map<String, String> map){
        return userService.verifyEmail(map.get("email"), map.get("code"));
    }

    @GetMapping("sendPhoneMessage/{phone}")
    public void sendPhoneMessage(@PathVariable String phone){
        userService.sendPhoneMessage(phone);
    }

    @RequestMapping("verifyPhoneMessage")
    public boolean verifyPhoneMessage(@RequestBody Map<String, String> map){
        return userService.verifyPhoneMessage(map.get("phone"), map.get("code"));
    }

    @RequestMapping("login")
    public UserDto login(@RequestBody UserDto userDto){
        User user = userService.login(toUser(userDto));
        return toUserDto(user);
    }

    @PostMapping("findId")
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
        return toUserDtoWithSNS(user);
    }

    @RequestMapping("updateUserInfo")
    public void updateUserInfo(@RequestBody UserDto userDto){
        userService.updateUserInfo(toUser(userDto));
    }

    @RequestMapping("updateEmail")
    public void updateEmail(@RequestBody UserDto userDto){
        userService.updateEmail(toUser(userDto));
    }

    @RequestMapping("updatePhone")
    public void updatePhone(@RequestBody UserDto userDto){
        userService.updatePhone(toUser(userDto));
    }

    @GetMapping("isDuplicatedEmail/{email}")
    public boolean isDuplicatedEmail(@PathVariable String email){
        return userService.isDuplicatedEmail(email);
    }

    @GetMapping("isDuplicatedPhone/{phone}")
    public boolean isDuplicatedPhone(@PathVariable String phone){
        return userService.isDuplicatedPhone(phone);
    }

    @RequestMapping("deleteUser")
    public void deleteUser(@RequestBody UserDto userDto){
        User user = toUser(userDto);
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

    @RequestMapping("notification")
    public String notification(@RequestBody UserDto userDto){
        User user = userService.findById(userDto.getUserNo());
        return user.isSendWebPush() ?   "on" : "off";
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

    private UserDto toUserDtoWithSNS(User user){
        if(user.getProfile()!=null){
            user.setProfile(downloadProfilePath+user.getProfile());
        }
        UserDto userDto = modelMapper.map(user, UserDto.class);
        userDto.setSnsDtoList(user.getSnsList().stream().map(this::toSNSDto).toList());
        return userDto;
    }
    

    private SNS toSNS(SNSDto snsDto){
        return modelMapper.map(snsDto, SNS.class);
    }

    private SNSDto toSNSDto(SNS sns){
        return modelMapper.map(sns, SNSDto.class);
    }

}
