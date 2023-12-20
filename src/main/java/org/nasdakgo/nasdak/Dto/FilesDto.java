package org.nasdakgo.nasdak.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilesDto {
    private long fileNo;

    private String filePath;

    private FileOwnerDto fileOwnerDto;
}
