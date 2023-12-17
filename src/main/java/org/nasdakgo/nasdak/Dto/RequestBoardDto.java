package org.nasdakgo.nasdak.Dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RequestBoardDto extends FileOwnerDto {

    private UserDto userDto;

    private String title;

    private String content;

    private long userNo;

    private List<RequestAnswerDto> requestAnswerDtoList = new ArrayList<>();


}
