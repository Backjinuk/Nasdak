package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private long userNo;

    private String userId;

    private String password;

    private String email;

    private String phone;

    private LocalDateTime regDate;

    private String profile;

    private List<CollectionDto> collectionDtoList = new ArrayList<>();
}
