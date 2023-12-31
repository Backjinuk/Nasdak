package org.nasdakgo.nasdak.Service;

import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.SNSRepository;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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


    // 네이버 정보 조회
    public String getProfile(String accessToken) {
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return get(apiURL,requestHeaders);
    }

    // 네이버 연동 계정 탈퇴
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

    // 네이버 연동 계정 확인
    public String naverRefreshCheck(String accessToken){
        accessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
        String header = "Bearer " + accessToken; // Bearer 다음에 공백 추가

        String apiURL = "https://openapi.naver.com/v1/nid/me";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);

        return get(apiURL,requestHeaders);
    }

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
}
