package org.nasdakgo.nasdak.Service;

import Utils.HttpUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
public class KakaoService implements ApiService{

    private final HttpUtil httpUtil;

    private final ObjectMapper objectMapper;

    @Value("${kakao.rest.api.key}")
    protected String kakaoRestApiKey;

    @Value("${kakao.admin.key}")
    protected String kakaoAdminKey;

    @Value("${kakao.secret}")
    protected String kakaoSecret;

    @Override
    public Map<String, String> getToken(String code, String state) throws JsonProcessingException {
        String apiURL = "https://kauth.kakao.com/oauth/token";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        String redirect_uri = "http://localhost:3000/snsLogin";
        Map<String, String> map = new HashMap<>();
        map.put("grant_type","authorization_code");
        map.put("client_id", kakaoRestApiKey);
        map.put("redirect_uri", redirect_uri);
        map.put("code", code);
        map.put("client_secret", URLEncoder.encode(kakaoSecret, StandardCharsets.UTF_8));
        String data = httpUtil.mapToParams(map);

        String json = httpUtil.post(apiURL, requestHeaders, data);

        return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
    }

    @Override
    public Map<String, String> getProfile(String accessToken) throws JsonProcessingException {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://kapi.kakao.com/v2/user/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);
        requestHeaders.put("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        String json = httpUtil.get(apiURL, requestHeaders);
        Map<String, Object> jsonMap = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        Map<String, Object> accountMap = (Map<String,Object>)jsonMap.get("kakao_account");
        Map<String, String> map = new HashMap<>();
        map.put("id", jsonMap.get("id").toString());
        Object email = accountMap.get("email");
        Object phone = accountMap.get("phone");
        if(email!=null) map.put("email", email.toString());
        if(phone!=null) map.put("phone", phone.toString());

        return map;
    }

    @Override
    public String disconnect(String accessToken) {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://kapi.kakao.com/v1/user/unlink";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return httpUtil.get(apiURL, requestHeaders);
    }

    @Override
    public boolean refreshCheck(String accessToken) throws JsonProcessingException {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://kapi.kakao.com/v1/user/access_token_info";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        String json = httpUtil.get(apiURL, requestHeaders);

        log.info(json);

        Object object = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {}).get("code");

        if(object == null) return false;

        String code = object.toString();

        return code.equals("-2")||code.equals("-401");
    }

    @Override
    public List<String> getNewToken(String refreshToken) throws JsonProcessingException {
        String apiURL = "https://kauth.kakao.com/oauth/token";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        Map<String, String> map = new HashMap<>();
        map.put("grant_type","refresh_token");
        map.put("client_id", kakaoRestApiKey);
        map.put("refresh_token", refreshToken);
        map.put("client_secret", URLEncoder.encode(kakaoSecret, StandardCharsets.UTF_8));
        String data = httpUtil.mapToParams(map);

        String json = httpUtil.post(apiURL, requestHeaders, data);
        map = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        if("KOE322".equals(map.get("error_code"))){
            return null;
        }
        List<String> list = new ArrayList<>();
        list.add(map.get("access_token"));
        String newRefreshToken = map.get("refresh_token");
        if(newRefreshToken!=null){
            list.add(newRefreshToken);
        }

        return list;
    }
}
