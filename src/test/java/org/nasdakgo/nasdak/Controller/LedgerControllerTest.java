package org.nasdakgo.nasdak.Controller;

import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.FilesDto;
import org.nasdakgo.nasdak.Dto.LedgerDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Service.FilesService;
import org.nasdakgo.nasdak.Service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootTest
class LedgerControllerTest {


    private final LedgerService ledgerService;


    private final FilesService filesService;

    private final ModelMapper modelMapper;

    @Value("${upload.file.path}")
    String filePath;

    @Autowired
    LedgerControllerTest(LedgerService ledgerService, FilesService filesService, ModelMapper modelMapper) {
        this.ledgerService = ledgerService;
        this.filesService = filesService;
        this.modelMapper = modelMapper;
    }

    @Test
    void ledgerList() {

        UserDto usersDto = new UserDto();

        usersDto.setUserNo(1L);

        List<LedgerDto> ledgerDtoList = ledgerService.findAllByUsers2(usersDto.getUserNo()).stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // List<LocalDateTime>을 Set<String>으로 변환합니다.
        Set<String> useDateSet = ledgerDtoList.stream()
                .map(ledger -> ledger.getUseDate().format(formatter))
                .sorted()
                .collect(Collectors.toCollection(LinkedHashSet::new));

        // Map<String, List<LedgerDto>>를 생성하고 값 넣기
        Map<String, List<LedgerDto>> sortedMap = useDateSet.stream()
                .collect(Collectors.groupingBy(
                        date -> LocalDate.parse(date, formatter).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).format(formatter),
                        Collectors.flatMapping(
                                date -> ledgerDtoList.stream()
                                        .filter(ledger -> ledger.getUseDate().format(formatter).equals(date))
                                        .peek(ledger -> {
                                            // 파일찾기 List => DtoList
                                            ledger.setFilesDtoList(
                                                    filesService.findByFileOwner(ledger.getFileOwnerNo())
                                                            .stream()
                                                            .map(files -> modelMapper.map(files, FilesDto.class))
                                                            .toList()
                                            );
                                        }),
                                Collectors.toList()
                        )
                ));

        List<String> collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();

        Map<String, List<LedgerDto>> ledgerMap = collect.stream()
                .collect(Collectors.toMap(
                        key -> key,
                        sortedMap::get,
                        (oldValue, newValue) -> newValue,
                        LinkedHashMap::new
                ));



        for (String s : ledgerMap.keySet()) {
            System.out.println(s);
            System.out.println(ledgerMap.get(s));
        }


    }
}