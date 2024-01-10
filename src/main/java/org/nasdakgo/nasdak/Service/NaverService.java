package org.nasdakgo.nasdak.Service;

import Utils.HttpUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NaverService implements ApiService{

    private final HttpUtil httpUtil;

    private final ObjectMapper objectMapper;

    @Value("${naver.client.id}")
    private String client_id;

    @Value("${naver.client.secret}")
    private String client_secret;

    // 토큰 발급
    @Override
    public Map<String, String> getToken(String code, String state) throws JsonProcessingException {

        String apiURL = "https://nid.naver.com/oauth2.0/token";
        apiURL += "?grant_type=authorization_code";
        apiURL += "&client_id="+client_id;
        apiURL += "&client_secret="+client_secret;
        apiURL += "&code="+code;
        apiURL += "&state="+state;

        Map<String, String> requestHeaders = new HashMap<>();

        String json = httpUtil.get(apiURL,requestHeaders);

        return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
    }

    // 정보 조회
    @Override
    public Map<String, Object> getProfile(String accessToken) throws JsonProcessingException {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        String json = httpUtil.get(apiURL,requestHeaders);
        Map<String, Object> profileResponse = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        return (Map<String, Object>)profileResponse.get("response");
    }

    // 연동 계정 탈퇴
    @Override
    public String disconnect(String accessToken) {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://nid.naver.com/oauth2.0/token?service_provider=NAVER&grant_type=delete";
        apiURL+="&client_id="+client_id;
        apiURL+="&client_secret="+client_secret;
        apiURL+="&access_token="+accessToken;

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return httpUtil.get(apiURL,requestHeaders);
    }

    // 연동 계정 확인
    @Override
    public boolean refreshCheck(String accessToken) throws JsonProcessingException {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        String json = httpUtil.get(apiURL, requestHeaders);

        return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {}).get("resultcode").equals("024");
    }

    // 토큰 재발급
    @Override
    public List<String> getNewToken(String refreshToken) throws JsonProcessingException {
        refreshToken = URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
        String apiURL = "https://nid.naver.com/oauth2.0/token";
        apiURL += "?grant_type=refresh_token";
        apiURL += "&client_id="+client_id;
        apiURL += "&client_secret="+client_secret;
        apiURL += "&refresh_token="+refreshToken;

        Map<String, String> requestHeaders = new HashMap<>();

        String json = httpUtil.get(apiURL, requestHeaders);

        Map<String, String> map = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        List<String> list = new ArrayList<>();
        list.add(map.get("access_token"));

        return list;
    }
}
