package org.nasdakgo.nasdak.Config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Dto.JwtTokenDto;
import org.nasdakgo.nasdak.Entity.RefreshTokenMap;
import org.nasdakgo.nasdak.Service.RefreshTokenMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Component
public class JwtTokenProvider {

    private final RefreshTokenMapService refreshTokenMapService;

    private final Key key;
    private final long sec = 1000L;
    private final long min = 60*sec;
    private final long hour = 60*min;
    private final long day = 24*hour;
    private final Long accessTokenExpiresIn = 10*min;
    private final Long refreshTokenExpiresIn = 10*day;

    // application.yml에서 secret 값 가져와서 key에 저장
    @Autowired
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, RefreshTokenMapService refreshTokenMapService) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.refreshTokenMapService = refreshTokenMapService;
    }

    // Member 정보를 가지고 AccessToken, RefreshToken을 생성하는 메서드
    public JwtTokenDto generateToken(Authentication authentication) {
        // 권한 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        log.info("authorities = " + authorities);

        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresDate = new Date(now + accessTokenExpiresIn);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth", authorities)
                .setExpiration(accessTokenExpiresDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        String refreshTokenMapKey = UUID.randomUUID().toString();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + refreshTokenExpiresIn))
                .signWith(key, SignatureAlgorithm.HS256)
                .claim("key", refreshTokenMapKey)
                .compact();

        RefreshTokenMap refreshTokenMap = RefreshTokenMap.builder()
                .authorities(authorities)
                .refreshTokenMapKey(refreshTokenMapKey)
                .expiredTime(new Date(now + refreshTokenExpiresIn).getTime())
                .name(authentication.getName())
                .build();

        refreshTokenMapService.saveRefreshTokenMap(refreshTokenMap);

        return JwtTokenDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshTokenExpiresIn(refreshTokenExpiresIn)
                .accessTokenExpiresIn(accessTokenExpiresIn)
                .userNo(authentication.getName())
                .build();
    }

    // Member 정보를 가지고 AccessToken, RefreshToken을 생성하는 메서드
    public JwtTokenDto refreshToken(String oldRefreshToken) {
        Claims claims = parseClaims(oldRefreshToken);
        RefreshTokenMap refreshTokenMap = refreshTokenMapService.getRefreshTokenMap((String)claims.get("key"));

        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresDate = new Date(now + accessTokenExpiresIn);
        String accessToken = Jwts.builder()
                .setSubject(refreshTokenMap.getName())
                .claim("auth", refreshTokenMap.getAuthorities())
                .setExpiration(accessTokenExpiresDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        String refreshTokenMapKey = UUID.randomUUID().toString();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + refreshTokenExpiresIn))
                .signWith(key, SignatureAlgorithm.HS256)
                .claim("key", refreshTokenMapKey)
                .compact();

        refreshTokenMapService.deleteRefreshTokenMap(refreshTokenMap.getRefreshTokenMapKey());

        refreshTokenMap = RefreshTokenMap.builder()
                .authorities(refreshTokenMap.getAuthorities())
                .refreshTokenMapKey(refreshTokenMapKey)
                .expiredTime(new Date(now + refreshTokenExpiresIn).getTime())
                .name(refreshTokenMap.getName())
                .build();

        refreshTokenMapService.saveRefreshTokenMap(refreshTokenMap);

        return JwtTokenDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshTokenExpiresIn(refreshTokenExpiresIn)
                .accessTokenExpiresIn(accessTokenExpiresIn)
                .userNo(refreshTokenMap.getName())
                .build();
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    // accessToken
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}