package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nasdakgo.nasdak.Entity.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {

    private long collectionNo;

    private long categoryNo;

    private UserDto userDto;

    private String content;

    private String delYn = "N";

    private long userNo;

    private User user;
}
