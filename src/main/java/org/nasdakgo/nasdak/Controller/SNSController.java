package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.SNSDto;
import org.nasdakgo.nasdak.Dto.SNSLoginDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.SNSType;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sns/")
@Log4j2
public class SNSController {

    private final SNSService snsService;

    private final UserService userService;

    private final ModelMapper modelMapper;

    private final NaverService naverService;

    private final KakaoService kakaoService;

    @Value("${download.file.profile}")
    private String downloadProfilePath;

    ////////////////////////////// 공통 //////////////////////////////
    @RequestMapping("/connect")
    public ResponseEntity<?> connect(@RequestBody SNSLoginDto snsLoginDto) throws Exception {
        SNS sns;
        if(snsLoginDto.isExist()){
            sns = snsService.findById(SNS.builder().snsNo(snsLoginDto.getSnsNo()).build());
            boolean duplicatied = snsService.isDuplicatiedSns(snsLoginDto.getSnsNo(), snsLoginDto.getUserNo());
            if(duplicatied) return new ResponseEntity<>(snsLoginDto.getSnsNo(), HttpStatus.INTERNAL_SERVER_ERROR);
        }else{
            sns = snsService.findCachedSns(snsLoginDto.getKey());
        }

        sns.setUser(User.builder().userNo(snsLoginDto.getUserNo()).build());
        User user = snsService.connect(sns);

        return new ResponseEntity<>(toUserDtoWithSNS(user),HttpStatus.OK);
    }

    @RequestMapping("/connectNewSNS/{key}")
    public SNSDto connectNewSNS(@RequestBody UserDto userDto, @PathVariable String key){
        User user = toUser(userDto);
        SNS sns = snsService.findCachedSns(key);
        if(user.getUserNo()==0){
            snsService.signUp(sns);
        }else{
            sns.setUser(user);
            snsService.connect(sns);
        }

        return toSNSDto(sns);
    }

    @RequestMapping("/deleteSnsMap/{key}")
    public void deleteSnsMap(@PathVariable String key){
        snsService.deleteCachedSns(key);
    }

    @RequestMapping("/snsLogin")
    public ResponseEntity<?> snsLogin(@RequestBody SNSDto snsDto) throws Exception {
        SNS find = snsService.findById(toSNS(snsDto));
        return new ResponseEntity<>(toSNSDto(find), HttpStatus.OK);
    }

    @RequestMapping("/isDuplicatedUserInfo")
    public ResponseEntity<SNSLoginDto> isDuplicatedUserInfo(@RequestBody SNSLoginDto snsLoginDto) throws Exception {
        SNS sns = snsService.findCachedSns(snsLoginDto.getKey());
        List<User> list = snsService.findExistedUser(sns);
        if(list.isEmpty()){
            snsLoginDto.setResult(false);
            return ResponseEntity.ok(snsLoginDto);
        }else{
            Map<String, Object> responseMap = new HashMap<>();
            List<UserDto> dtoList = new ArrayList<>();
            list.forEach(user -> dtoList.add(toUserDtoWithSNS(user)));
            snsLoginDto.setExistUsers(dtoList);
            snsLoginDto.setResult(true);
            return ResponseEntity.ok(snsLoginDto);
        }
    }

    @RequestMapping("/signUp")
    public ResponseEntity<SNSDto> signUp(@RequestBody SNSLoginDto snsLoginDto) throws Exception {
        SNS sns = snsService.findCachedSns(snsLoginDto.getKey());
        snsService.signUp(sns);
        return ResponseEntity.ok(toSNSDto(sns));
    }

    @RequestMapping("/disconnect")
    public boolean disconnect(@RequestBody SNSDto snsDto) throws Exception {
        // Api 지정
        ApiService apiService = getApiService(snsDto.getSnsType());

        // 해당 sns 계정 정보 가져오기
        SNS sns = snsService.findByUserAndSnsType(toSNSWithUser(snsDto));

        // 토큰 유효성 검사
        if(snsDto.getAccessToken()==null||apiService.refreshCheck(snsDto.getAccessToken())){
            // 만료된 토큰 재발급
            List<String> tokenList = apiService.getNewToken(sns.getRefreshToken());
            if(tokenList==null){
                return false;
            }
            String accessToken = tokenList.get(0);
            snsDto.setAccessToken(accessToken);

            // 리프레시 토큰 있을 경우 갱신
            if(tokenList.size()==2){
                sns.setRefreshToken(tokenList.get(1));
                snsService.updateRefreshToken(sns);
            }
        }

        // 연동 종료
        String disconnect = apiService.disconnect(snsDto.getAccessToken());
        snsService.disconnect(sns);
        return true;
    }

    @RequestMapping("/changeConnection")
    public void changeConnection(@RequestBody SNSDto snsDto){
        SNS sns = toSNSWithUser(snsDto);
        User find = snsService.findUserBySns(sns);
        snsService.changeConnection(sns);
        if(find.getUserId()==null&&snsService.findByUser(find).isEmpty()){
            userService.deleteUser(find);
        }
    }

    private ApiService getApiService(SNSType snsType) throws Exception {
        switch (snsType){
            case NAVER -> {
                return naverService;
            }
            case KAKAO -> {
                return kakaoService;
            }
        }
        throw new Exception();
    }
    ////////////////////////////// 공통 //////////////////////////////

    // Entity <-> Dto 변환
    private SNS toSNS(SNSDto snsDto){
        return modelMapper.map(snsDto, SNS.class);
    }
    private SNS toSNSWithUser(SNSDto snsDto){
        SNS sns = modelMapper.map(snsDto, SNS.class);
        sns.setUser(User.builder().userNo(snsDto.getUserNo()).build());
        return sns;
    }
    private SNSDto toSNSDto(SNS sns){
        SNSDto snsDto = modelMapper.map(sns, SNSDto.class);
        snsDto.setUserNo(sns.getUser().getUserNo());
        return snsDto;
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

}
