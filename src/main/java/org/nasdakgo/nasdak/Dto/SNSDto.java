package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNSType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SNSDto {

    private long snsNo;

    private String snsId;

    private UserDto userDto;

    private long userNo;

    private SNSType snsType;

    private String accessToken;

    private String refreshToken;
}
