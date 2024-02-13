package org.nasdakgo.nasdak.Dto;

import Utils.DataUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nasdakgo.nasdak.Entity.LedgerType;
import org.nasdakgo.nasdak.Entity.Location;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LedgerDto extends FileOwnerDto {

    private UserDto userDto;

    private CategoryDto categoryDto;

    private long price;

    private long price2;

    private LedgerType ledgerType;

    private LedgerType ledgerType2;

    private Location location;

    private String comment;

    private LocalDateTime useDate = DataUtils.parseDateTime(DataUtils.getCurrentDateTimeAsString());

    private List<FilesDto> filesDtoList = new ArrayList<>();

    private long userNo;

    private String regDate2;

    private String originRegDat;
}
