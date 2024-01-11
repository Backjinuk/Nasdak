package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {

    private long categoryNo;

    private UserDto userDto;

    private String content;

    private String delYn = "N";

    private long userNo;
}
