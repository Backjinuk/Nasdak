package org.nasdakgo.nasdak.Dto;

import Utils.DataUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.LedgerType;
import org.nasdakgo.nasdak.Entity.Location;
import org.nasdakgo.nasdak.Entity.User;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LedgerDto extends FileOwnerDto {

    private UserDto userDto;

    private CategoryDto categoryDto;

    private long price;

    private LedgerType ledgerType;

    private Location location;

    private String comment;

    private LocalDateTime useDate = DataUtils.parseDateTime(DataUtils.getCurrentDateTimeAsString());

    private User user;

    private Category category;

    private long userNo;

    private String regDate2;

    private String originRegDat;
}
