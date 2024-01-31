package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Config.JwtTokenProvider;
import org.nasdakgo.nasdak.Dto.JwtTokenDto;
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

    @RequestMapping("refreshToken")
    public ResponseEntity<JwtTokenDto> refreshToken(@RequestBody JwtTokenDto inputDto){
        String refreshToken = inputDto.getRefreshToken();
        log.info("refreshToken : "+refreshToken);
        try{
            Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
            JwtTokenDto jwtTokenDto = jwtTokenProvider.generateToken(authentication);
            return ResponseEntity.ok(jwtTokenDto);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
