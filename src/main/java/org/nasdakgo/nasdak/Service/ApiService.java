package org.nasdakgo.nasdak.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface ApiService {

    // 토큰 발급
    Map<String, String> getToken(String code, String state) throws JsonProcessingException;

    // 정보 조회
    Map<String, Object> getProfile(String accessToken) throws JsonProcessingException;

    // 연동 계정 탈퇴
    String disconnect(String accessToken);

    // 연동 계정 확인
    boolean refreshCheck(String accessToken) throws JsonProcessingException;

    // 토큰 재발급
    List<String> getNewToken(String refreshToken) throws JsonProcessingException;
}
