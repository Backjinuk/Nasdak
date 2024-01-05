package org.nasdakgo.nasdak.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.SNSDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.SNSType;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.SNSService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sns/")
@Log4j2
public class SNSController {

    private final SNSService snsService;

    private final CategoryService categoryService;

    private final ModelMapper modelMapper;

    private final ObjectMapper objectMapper;

    @Value("${download.file.profile}")
    private String downloadProfilePath;

    ////////////////////////////// 공통 //////////////////////////////
    private SNSDto snsLogin(SNS sns){
        // 로그인 수행
        SNS find = snsService.login(sns);

        // 계정이 없을 경우 신규 가입
        if(find==null){
            find = snsService.signUp(sns);
            categoryService.saveDefaultCategory(find.getUser());
        }

        // 카카오는 리프레시 토큰 갱신
        if(sns.getSnsType()==SNSType.KAKAO){
            find.setRefreshToken(sns.getRefreshToken());
            snsService.updateRefreshToken(find);
        }
        return toSNSDto(find);
    }
    ////////////////////////////// 공통 //////////////////////////////

    ////////////////////////////// NAVER //////////////////////////////
    // 토큰 발행부터 로그인까지 실행
    @RequestMapping("/naver/getToken")
    public SNSDto naverGetToken(@RequestBody Map<String, String> map) throws JsonProcessingException {
        // 토큰 데이터 받아오기
        String json = snsService.naverGetToken(map.get("code"), map.get("state"));
        Map<String, String> tokenData = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});

        // 프로필 정보 받아오기
        String profileJson = snsService.naverGetProfile(tokenData.get("access_token"));
        Map<String, Object> profileResponse = objectMapper.readValue(profileJson, new TypeReference<Map<String, Object>>() {});
        Map<String, String> profile = (Map<String, String>)profileResponse.get("response");
        SNS sns = SNS.builder()
                .snsId(profile.get("id"))
                .refreshToken(tokenData.get("refresh_token"))
                .snsType(SNSType.NAVER)
                .build();

        // 로그인 수행
        SNSDto loginData = this.snsLogin(sns);
        loginData.setAccessToken(tokenData.get("access_token"));
        return loginData;
    }

    @RequestMapping("/naver/getProfile")
    public String naverGetProfile(@RequestBody Map<String, String> map){
        String accessToken = map.get("access_token");
        return snsService.naverGetProfile(accessToken);
    }

    @RequestMapping("/naver/delete")
    public void naverDelete(@RequestBody SNSDto snsDto) throws JsonProcessingException {
        // 해당 sns 계정 정보 가져오기
        SNS sns = snsService.findByUser(User.builder().userNo(snsDto.getUserNo()).build());

        // 토큰 유효성 검사
        String refreshCheck = snsService.naverRefreshCheck(snsDto.getAccessToken());

        // 만료된 토큰 재발급
        if(objectMapper.readValue(refreshCheck, new TypeReference<Map<String, Object>>() {}).get("resultcode").equals("024")){
            String json = snsService.naverGetNewToken(sns.getRefreshToken());
            Map<String, String> map = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
            String accessToken = map.get("access_token");
            snsDto.setAccessToken(accessToken);
        }

        // 네이버 연동 종료
        snsService.naverDelete(snsDto.getAccessToken());
    }

    @RequestMapping("/naver/refreshCheck")
    public void naverRefreshCheck(@RequestBody SNSDto snsDto){
        SNS sns = snsService.findByUser(User.builder().userNo(snsDto.getUserNo()).build());
        snsService.naverRefreshCheck(snsDto.getAccessToken());
    }
    ////////////////////////////// NAVER //////////////////////////////

    ////////////////////////////// KAKAO //////////////////////////////
    @RequestMapping("/kakao/getToken")
    public SNSDto kakaoGetToken(@RequestBody Map<String, String> map) throws JsonProcessingException {
        // 토큰 데이터 받아오기
        String jsonToken = snsService.kakaoGetToken(map.get("code"));
        Map<String, String> tokenData = objectMapper.readValue(jsonToken, new TypeReference<Map<String, String>>() {});

        // 프로필 정보 받아오기
        String profileJson = snsService.kakaoGetProfile(tokenData.get("access_token"));
        Map<String, Object> profile = objectMapper.readValue(profileJson, new TypeReference<Map<String, Object>>() {});
        SNS sns = SNS.builder()
                .snsId(profile.get("id").toString())
                .refreshToken(tokenData.get("refresh_token"))
                .snsType(SNSType.KAKAO)
                .build();

        // 로그인 수행
        SNSDto loginData = this.snsLogin(sns);
        loginData.setAccessToken(tokenData.get("access_token"));
        return loginData;
    }
    ////////////////////////////// KAKAO //////////////////////////////

    // Entity <-> Dto 변환
    private SNS toSNS(SNSDto snsDto){
        return modelMapper.map(snsDto, SNS.class);
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

}
