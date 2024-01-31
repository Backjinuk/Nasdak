package org.nasdakgo.nasdak.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Dto.JwtTokenDto;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Service.SNSService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Log4j2
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    private final SNSService snsService;

    private final OAuth2AuthorizedClientRepository clientRepository;

    @Value("${path.front}")
    private String frontBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        log.info("Principal에서 꺼낸 OAuth2User = {}", oAuth2User);

        String refreshToken = getRefreshToken(oAuth2User, authentication, request);
        log.info("refreshToken = " + refreshToken);

        SNS sns = SNS.builder()
                .snsId(oAuth2User.getName())
                .refreshToken(refreshToken)
                .snsType(oAuth2User.getAttribute("type"))
                .email(oAuth2User.getAttribute("email"))
                .phone(oAuth2User.getAttribute("phone"))
                .build();
        SNS find = snsService.login(sns);

        log.info("토큰 발행 시작");
        JwtTokenDto token = jwtTokenProvider.generateToken(authentication);
        log.info("{}", token);

        log.info("url 설정");
        String targetUrl = getTargetUrl(token, find, sns);
        log.info("url = {}", targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String getRefreshToken(OAuth2User oAuth2User, Authentication authentication, HttpServletRequest request){
        String clientRegistrationId = oAuth2User.getAttribute("type").toString().toLowerCase();
        OAuth2AuthorizedClient client = clientRepository.loadAuthorizedClient(clientRegistrationId, authentication, request);
        OAuth2RefreshToken refreshToken = client.getRefreshToken();
        return refreshToken.getTokenValue();
    }

    private String getTargetUrl(JwtTokenDto token, SNS find, SNS sns){
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(frontBaseUrl + "/snsLogin")
                .queryParam("accessToken", token.getAccessToken())
                .queryParam("refreshToken", token.getRefreshToken())
                .queryParam("accessTokenExpiresIn", token.getAccessTokenExpiresIn())
                .queryParam("refreshTokenExpiresIn", token.getRefreshTokenExpiresIn());
        if(find==null){
            builder.queryParam("result", "new");
            String key = snsService.cacheSns(sns);
            builder.queryParam("key", key);
        }else{
            snsService.updateRefreshToken(sns);
            builder.queryParam("result", "exist");
            builder.queryParam("snsNo", find.getSnsNo());
        }
        return builder.build().toUriString();
    }
}
