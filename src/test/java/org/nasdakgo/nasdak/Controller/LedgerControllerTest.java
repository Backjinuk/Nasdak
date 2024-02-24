package org.nasdakgo.nasdak.Controller;

import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.FilesDto;
import org.nasdakgo.nasdak.Dto.LedgerDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Service.FilesService;
import org.nasdakgo.nasdak.Service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

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

//        UserDto usersDto = new UserDto();
//
//        usersDto.setUserNo(1L);
//
//        List<LedgerDto> ledgerDtoList = ledgerService.findAllByUsers2(usersDto.getUserNo()).stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();
//
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//        // List<LocalDateTime>을 Set<String>으로 변환합니다.
//        Set<String> useDateSet = ledgerDtoList.stream()
//                .map(ledger -> ledger.getUseDate().format(formatter))
//                .sorted()
//                .collect(Collectors.toCollection(LinkedHashSet::new));
//
//        // Map<String, List<LedgerDto>>를 생성하고 값 넣기
//        Map<String, List<LedgerDto>> sortedMap = useDateSet.stream()
//                .collect(Collectors.groupingBy(
//                        date -> LocalDate.parse(date, formatter).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).format(formatter),
//                        Collectors.flatMapping(
//                                date -> ledgerDtoList.stream()
//                                        .filter(ledger -> ledger.getUseDate().format(formatter).equals(date))
//                                        .peek(ledger -> {
//                                            // 파일찾기 List => DtoList
//                                            ledger.setFilesDtoList(
//                                                    filesService.findByFileOwner(ledger.getFileOwnerNo())
//                                                            .stream()
//                                                            .map(files -> modelMapper.map(files, FilesDto.class))
//                                                            .toList()
//                                            );
//                                        }),
//                                Collectors.toList()
//                        )
//                ));
//
//        List<String> collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();
//
//        Map<String, List<LedgerDto>> ledgerMap = collect.stream()
//                .collect(Collectors.toMap(
//                        key -> key,
//                        sortedMap::get,
//                        (oldValue, newValue) -> newValue,
//                        LinkedHashMap::new
//                ));
//
//
//
//        for (String s : ledgerMap.keySet()) {
//            System.out.println(s);
//            System.out.println(ledgerMap.get(s));
//        }


    }

    @Test
    public void ledgerItem(){
        int startPaging = 0;
        int endPaging = 10;


        UserDto usersDto = new UserDto();
        usersDto.setUserNo(1L);

        List<String> allByUsers = ledgerService.findAllByUsers(usersDto.getUserNo(), startPaging, endPaging);

        System.out.println("allByUsers = " + allByUsers.get(0));
        System.out.println("allByUsers = " + allByUsers.get(allByUsers.size()-1));

        List<LedgerDto> ledgers = ledgerService.ledgerItem(allByUsers.get(allByUsers.size() - 1), allByUsers.get(0), modelMapper.map(usersDto, UserDto.class).getUserNo())
                .stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();

        for (LedgerDto ledger : ledgers) {
            System.out.println("ledger = " + ledger);
        }
    }
/*
    @Test
    public void testLedgerDateList(){
        int startPaging = 0;
        int endPaging = 10;

        UserDto usersDto = new UserDto();
        usersDto.setUserNo(1L);

        List<String> ledgerDateList = ledgerService.getLedgerDateList(usersDto.getUserNo(), startPaging, endPaging);

        List<LedgerDto> list = ledgerService.getLedgerList(ledgerDateList.get(ledgerDateList.size() - 1),
                ledgerDateList.get(0), usersDto.getUserNo()).stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();

        for (LedgerDto ledgerDto : list) {
            System.out.println("ledgerDto = " + ledgerDto);
        }
    }*/
    
    
    @Test
    public void testLedgerAllList(){
        UserDto usersDto = new UserDto();
        usersDto.setUserNo(1L);

        LocalDateTime startDate2 = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String format = startDate2.format(formatter);

        LocalDate startDate = LocalDate.parse(format, formatter).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endDate = startDate.plusDays(6);

        System.out.println("format = " + startDate);
        System.out.println("format2 = " + endDate);

        List<LedgerDto> list = new ArrayList<>();
                list = ledgerService.getLedgerList(startDate, endDate, usersDto.getUserNo()).stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();

        int count = 0;
        while (list.isEmpty()) {
            list = ledgerService.getLedgerList(startDate.minusDays(7), endDate, usersDto.getUserNo()).stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).toList();
            System.out.println("비어있음");

            if (count > 10) {
                break;
            }

            count++;
        }

        for (LedgerDto ledgerDto : list) {
            System.out.println("ledgerDto = " + ledgerDto);

        }


    }
    
    
    
}