package org.nasdakgo.nasdak.Dto;

import java.time.LocalDateTime;
import java.util.List;

public class CollectionDto {

    private long collectionNo;
    private UserDto userDto;
    private String title;
    private LocalDateTime regDate;
    private List<LedgerRelationDto> ledgerRelationDtoList;

}
