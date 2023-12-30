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

    @RequestMapping("/naver/getProfile")
    public String naverGetProfile(@RequestBody Map<String, String> map){
        String accessToken = map.get("access_token");
        return snsService.getProfile(accessToken);
    }

    @RequestMapping("/naver/getToken")
    public SNSDto naverGetToken(@RequestBody Map<String, String> map) throws JsonProcessingException {
        String json = snsService.naverGetToken(map.get("code"), map.get("state"));
        Map<String, String> tokenData = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        String profileJson = this.naverGetProfile(tokenData);
        Map<String, Object> profileResponse = objectMapper.readValue(profileJson, new TypeReference<Map<String, Object>>() {});
        Map<String, String> profile = (Map<String, String>)profileResponse.get("response");
        SNSDto snsDto = SNSDto.builder()
                .snsId(profile.get("id"))
                .refreshToken(tokenData.get("refresh_token"))
                .snsType(SNSType.NAVER)
                .build();
        SNSDto loginData = this.naverLogin(snsDto);
        loginData.setAccessToken(tokenData.get("access_token"));
        return loginData;
    }

    @RequestMapping("/naver/login")
    public SNSDto naverLogin(@RequestBody SNSDto snsDto){
        SNS sns = snsService.login(toSNS(snsDto));
        if(sns==null){
            sns = snsService.signUp(toSNS(snsDto));
            categoryService.saveDefaultCategory(sns.getUser());
        }
        return toSNSDto(sns);
    }

    @RequestMapping("/naver/delete")
    public void naverDelete(@RequestBody SNSDto snsDto) throws JsonProcessingException {
        SNS sns = snsService.findByUser(User.builder().userNo(snsDto.getUserNo()).build());
        String refreshCheck = snsService.naverRefreshCheck(snsDto.getAccessToken());
        if(objectMapper.readValue(refreshCheck, new TypeReference<Map<String, Object>>() {}).get("resultcode").equals("024")){
            String json = snsService.naverGetNewToken(sns.getRefreshToken());
            Map<String, String> map = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
            String accessToken = map.get("access_token");
            snsDto.setAccessToken(accessToken);
        }
        String s = snsService.naverDelete(snsDto.getAccessToken());
    }

    @RequestMapping("/naver/refreshCheck")
    public void naverRefreshCheck(@RequestBody SNSDto snsDto){
        SNS sns = snsService.findByUser(User.builder().userNo(snsDto.getUserNo()).build());
        snsService.naverRefreshCheck(snsDto.getAccessToken());
    }

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
