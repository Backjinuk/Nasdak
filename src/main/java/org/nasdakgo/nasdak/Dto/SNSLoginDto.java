package org.nasdakgo.nasdak.Dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SNSLoginDto {
    private boolean result;
    private boolean exist;
    private String key;
    private long userNo;
    private long snsNo;
    private List<UserDto> existUsers;
}
