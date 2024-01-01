package org.nasdakgo.nasdak.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.SNSRepository;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SNSService {

    private final SNSRepository snsRepository;

    private final UserRepository userRepository;

    @Value("${naver.client.id}")
    private String client_id;

    @Value("${naver.client.secret}")
    private String client_secret;

    @Value("${kakao.rest.api.key}")
    private String kakaoRestApiKey;

    @Value("${kakao.admin.key}")
    private String kakaoAdminKey;

    @Value("${kakao.secret}")
    private String kakaoSecret;

    public SNS login(SNS sns){
        return snsRepository.login(sns.getSnsId()).orElse(null);
    }

    public SNS signUp(SNS sns){
        String random = UUID.randomUUID().toString();
        User user = User.builder()
                .userId(random)
                .email(random)
                .phone(random)
                .password(random)
                .activeUser(true)
                .regDate(LocalDateTime.now())
                .sendKakaoTalk(false)
                .sendWebPush(false)
                .build();
        userRepository.save(user);
        sns.setUser(user);
        snsRepository.save(sns);
        return sns;
    }

    public SNS findByUser(User user){
        return snsRepository.findByUser_UserNo(user.getUserNo());
    }

    public void updateRefreshToken(SNS sns){
        snsRepository.updateRefreshToken(sns.getSnsNo(), sns.getRefreshToken());
    }

    public void deleteUser(User user){
        String trash = UUID.randomUUID().toString();
        snsRepository.deleteSNSUser(user.getUserNo(), trash);
    }


    ////////////////////////////// NAVER //////////////////////////////
    // 토큰 발급
    public String naverGetToken(String code, String state){

        String apiURL = "https://nid.naver.com/oauth2.0/token";
        apiURL += "?grant_type=authorization_code";
        apiURL += "&client_id="+client_id;
        apiURL += "&client_secret="+client_secret;
        apiURL += "&code="+code;
        apiURL += "&state="+state;

        Map<String, String> requestHeaders = new HashMap<>();

        return get(apiURL,requestHeaders);
    }

    // 정보 조회
    public String naverGetProfile(String accessToken) {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return get(apiURL,requestHeaders);
    }

    // 연동 계정 탈퇴
    public String naverDelete(String accessToken){
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://nid.naver.com/oauth2.0/token?service_provider=NAVER&grant_type=delete";
        apiURL+="&client_id="+client_id;
        apiURL+="&client_secret="+client_secret;
        apiURL+="&access_token="+accessToken;

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return get(apiURL,requestHeaders);
    }

    // 연동 계정 확인
    public String naverRefreshCheck(String accessToken){
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return get(apiURL,requestHeaders);
    }

    // 토큰 재발급
    public String naverGetNewToken(String refreshToken){
        refreshToken = URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
        String apiURL = "https://nid.naver.com/oauth2.0/token";
        apiURL += "?grant_type=refresh_token";
        apiURL += "&client_id="+client_id;
        apiURL += "&client_secret="+client_secret;
        apiURL += "&refresh_token="+refreshToken;

        Map<String, String> requestHeaders = new HashMap<>();

        return get(apiURL,requestHeaders);
    }
    ////////////////////////////// NAVER //////////////////////////////

    ////////////////////////////// KAKAO //////////////////////////////
    // 토큰 발급
    public String kakaoGetToken(String code) throws JsonProcessingException {
        String apiURL = "https://kauth.kakao.com/oauth/token";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        String redirect_uri = "http://localhost:3000/kakao";
        Map<String, String> map = new HashMap<>();
        map.put("grant_type","authorization_code");
        map.put("client_id", kakaoRestApiKey);
        map.put("redirect_uri", redirect_uri);
        map.put("code", code);
        map.put("client_secret", URLEncoder.encode(kakaoSecret, StandardCharsets.UTF_8));
        String data = mapToParams(map);

        return post(apiURL,requestHeaders,data);
    }

    // 정보 조회
    public String kakaoGetProfile(String accessToken) {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://kapi.kakao.com/v2/user/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);
        requestHeaders.put("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        return get(apiURL,requestHeaders);
    }
    ////////////////////////////// KAKAO //////////////////////////////

    // request 보내기
    private String get(String apiUrl, Map<String, String> requestHeaders){
        HttpURLConnection con = connect(apiUrl);
        try {
            con.setRequestMethod("GET");
            for(Map.Entry<String, String> header :requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }


            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
                return readBody(con.getInputStream());
            } else { // 에러 발생
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
        }
    }
    private String post(String apiUrl, Map<String, String> requestHeaders, String data){
        HttpURLConnection con = connect(apiUrl);
        OutputStreamWriter writer = null;
        try {
            con.setRequestMethod("POST");
            for(Map.Entry<String, String> header :requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }

            con.setDoOutput(true);
            writer = new OutputStreamWriter(con.getOutputStream());
            writer.write(data);
            writer.flush();

            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
                return readBody(con.getInputStream());
            } else { // 에러 발생
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
            if (writer != null) try { writer.close(); } catch (Exception ignore) { }
        }
    }
    private HttpURLConnection connect(String apiUrl){
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection)url.openConnection();
        } catch (MalformedURLException e) {
            throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
        } catch (IOException e) {
            throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
        }
    }
    private String readBody(InputStream body){
        InputStreamReader streamReader = new InputStreamReader(body);


        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();


            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }


            return responseBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는데 실패했습니다.", e);
        }
    }
    public String mapToParams(Map<String, String > map) {
        StringBuilder paramBuilder = new StringBuilder();
        for (String key : map.keySet()) {
            paramBuilder.append(!paramBuilder.isEmpty() ? "&" : "");
            paramBuilder.append(String.format("%s=%s", URLEncoder.encode(key,StandardCharsets.UTF_8),
                    URLEncoder.encode(map.get(key),StandardCharsets.UTF_8)));
        }
        return paramBuilder.toString();
    }
}
