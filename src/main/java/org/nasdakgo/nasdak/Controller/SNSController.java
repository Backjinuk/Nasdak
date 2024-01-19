package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.SNSDto;
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

import java.util.*;

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

    private final Map<String, SNS> snsMap = new HashMap<>();

    @Value("${download.file.profile}")
    private String downloadProfilePath;

    ////////////////////////////// 공통 //////////////////////////////
    // 플랫폼의 API를 통해 토큰 조회 및 SNS 생성 후 반환
    private SNS connectSNS(Map<String, String> map) throws Exception {
        // snsType 지정
        SNSType snsType = SNSType.valueOf(map.get("snsType"));
        
        // 해당 service 지정
        ApiService apiService = getApiService(snsType);

        // 토큰 데이터 받아오기
        Map<String, String> tokenData = apiService.getToken(map.get("code"),map.get("state"));

        // 프로필 정보 받아오기
        Map<String, String> profile = apiService.getProfile(tokenData.get("access_token"));
        SNS sns = SNS.builder()
                .snsId(profile.get("id"))
                .refreshToken(tokenData.get("refresh_token"))
                .snsType(snsType)
                .accessToken(tokenData.get("access_token"))
                .email(profile.get("email"))
                .phone(profile.get("phone"))
                .build();

        return sns;
    }

    @RequestMapping("/connect")
    public ResponseEntity<?> connect(@RequestBody Map<String, String> map) throws Exception {
        SNS sns = connectSNS(map);

        sns.setUser(User.builder().userNo(Long.parseLong(map.get("userNo"))).build());

        long existSnsNo = snsService.connectCheck(sns);
        if(existSnsNo!=0) return new ResponseEntity<>(existSnsNo, HttpStatus.INTERNAL_SERVER_ERROR);

        User user = snsService.connect(sns);

        return new ResponseEntity<>(toUserDtoWithSNS(user),HttpStatus.OK);
    }

    @RequestMapping("/connectNewSNS/{key}")
    public SNSDto connectNewSNS(@RequestBody UserDto userDto, @PathVariable String key){
        User user = toUser(userDto);
        SNS sns = snsMap.get(key);
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
        snsMap.remove(key);
    }

    @RequestMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> map) throws Exception {
        SNS sns = connectSNS(map);

        SNS find = snsService.login(sns);

        if(find==null){
            List<User> list = snsService.findExistedUser(sns);
            if(list.isEmpty()){
                find = snsService.signUp(sns);
            }else{
                String key = UUID.randomUUID().toString();
                snsMap.put(key,sns);
                Map<String, Object> responseMap = new HashMap<>();
                List<UserDto> dtoList = new ArrayList<>();
                responseMap.put("key",key);
                list.forEach(user -> dtoList.add(toUserDtoWithSNS(user)));
                responseMap.put("existUsers",dtoList);
                return new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        if(sns.getSnsType()==SNSType.KAKAO){
            find.setRefreshToken(sns.getRefreshToken());
            snsService.updateRefreshToken(find);
        }

        find.setAccessToken(sns.getAccessToken());
        return new ResponseEntity<>(toSNSDto(find), HttpStatus.OK);
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
        return modelMapper.map(sns, SNSDto.class);
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
