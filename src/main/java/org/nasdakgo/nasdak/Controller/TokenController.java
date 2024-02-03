package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Config.JwtTokenProvider;
import org.nasdakgo.nasdak.Dto.JwtTokenDto;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Service.SNSService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/token")
public class TokenController {

    private final JwtTokenProvider jwtTokenProvider;
    private final SNSService snsService;
    private final UserService userService;

    @RequestMapping("refreshToken")
    public ResponseEntity<JwtTokenDto> refreshToken(@RequestBody JwtTokenDto inputDto){
        String refreshToken = inputDto.getRefreshToken();
        log.info("refreshToken : "+refreshToken);
        try{
            Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
            JwtTokenDto jwtTokenDto = jwtTokenProvider.generateToken(authentication, jwtTokenProvider.getType(refreshToken));
            return ResponseEntity.ok(jwtTokenDto);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    
    @RequestMapping("getUserNo")
    public Long getUserNo(@RequestBody JwtTokenDto inputDto){
        System.out.println("inputDto = " + inputDto);
        String accessToken = inputDto.getAccessToken();
        System.out.println("accessToken = " + accessToken);
        String type = jwtTokenProvider.getType(accessToken);
        String name = jwtTokenProvider.getAuthentication(accessToken).getName();
        if(type.equals("sns")){
            SNS sns = snsService.login(SNS.builder().snsId(name).build());
            return sns.getUser().getUserNo();
        }else{
            return Long.parseLong(name);
        }
    }
}
