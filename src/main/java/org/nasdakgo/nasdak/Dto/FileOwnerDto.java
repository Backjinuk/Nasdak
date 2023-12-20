package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileOwnerDto {
    private long fileOwnerNo;

    private List<FilesDto> filesDtoList;

}
