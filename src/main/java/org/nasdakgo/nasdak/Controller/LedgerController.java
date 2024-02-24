package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.*;
import org.nasdakgo.nasdak.Entity.*;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.FilesService;
import org.nasdakgo.nasdak.Service.LedgerService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ledger/")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    private final UserService userService;

    private final CategoryService categoryService;

    private final FilesService filesService;

    private final ModelMapper modelMapper;

    @Value("${upload.file.path}")
    String filePath;

    /**
     * @param requestData
     * @return
     * @apiNote DB User * @throws Exception
     */
    @RequestMapping("ledgerSave")
    public LedgerDto ledgerSave2(@RequestBody Map<String, LedgerDto> requestData) {
        System.out.println("ledgerDto = " + requestData.get("LedgerDto"));

        Ledger ledger = modelMapper.map(requestData.get("LedgerDto"), Ledger.class);

        ledger.setUser(new User(requestData.get("LedgerDto").getUserDto().getUserNo()));
        ledger.setCategory(new Category(requestData.get("LedgerDto").getCategoryDto().getCategoryNo()));

        // 기존의 User와 Category를 참조하여 설정
        //ledger.setUser(userService.findById(requestData.get("LedgerDto").getUserDto().getUserNo()));
        //ledger.setCategory(categoryService.findById(requestData.get("LedgerDto").getCategoryDto().getCategoryNo()));

        ledgerService.save(ledger);

        return modelMapper.map(ledger, LedgerDto.class);

    }

    /**
     * Show page of the user page.
     *
     * @param usersDto
     * @return List<?>
     * @apiNote UserId를 기반으로 ledger의 날짜를 가지고 오는 기능
     */
    @RequestMapping("LedgerAllDayList")
    public Map<String, List<?>> LedgerList(Authentication authentication, @RequestBody Map<String, Object> map) {

        List<LedgerDto> allByUsers2 = new ArrayList<>();

        String searchKey = String.valueOf(map.get("searchKey"));

        System.out.println("searchKey = " + searchKey);

        if(searchKey.equals("Day")) {

            int startPage = (map.get("startPage") == null) ? 0 : Integer.parseInt(String.valueOf(map.get("startPage")));
            int endPage = (map.get("endPage") == null) ? 5 : Integer.parseInt(String.valueOf(map.get("endPage")));
            long userNo = Long.parseLong(String.valueOf(toUser(authentication).getUserNo()));

            System.out.println("startPage = " + startPage);
            System.out.println("endPage = " + endPage);

            List<String> allByUsers = ledgerService.findAllByUsers(userNo, startPage, endPage);

            if (allByUsers.isEmpty()) {
                return new HashMap<>();
            }

            allByUsers2 = ledgerService.ledgerItem(allByUsers.get(allByUsers.size() - 1), allByUsers.get(0), userNo)
                    .stream()
                    .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                    .collect(Collectors.toList());
        } else  {

                LocalDateTime startDate2 = LocalDateTime.now();

                if (map.get("startDate") != null) {
                    startDate2 = LocalDateTime.parse(String.valueOf(map.get("startDate")));
                }

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                String format = startDate2.format(formatter);

                LocalDate startDate = null;
                LocalDate endDate = null;

                switch (String.valueOf(map.get("searchKey"))) {
                    case "Week":
                        startDate = LocalDate.parse(format, formatter).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                        endDate = startDate.plusDays(6);
                        break;

                    case "Month":
                        startDate = LocalDate.parse(format, formatter).with(TemporalAdjusters.firstDayOfMonth());
                        endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
                        break;

                    case "Month3":
                        startDate = LocalDate.parse(format, formatter).with(TemporalAdjusters.firstDayOfMonth()).plusMonths(2);
                        endDate = LocalDate.parse(format, formatter).with(TemporalAdjusters.lastDayOfMonth());
                        break;

                    default:
                        break;
                }

                allByUsers2 = ledgerService.getLedgerList(startDate, endDate, toUser(authentication).getUserNo())
                                            .stream()
                                            .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                                            .collect(Collectors.toList());

            allByUsers2 = sumPrice(allByUsers2);
        }

        return TranformMap(allByUsers2, searchKey);
    }

    @RequestMapping("ledgerWeekMonthList")
    public Map<String, List<?> > ledgerWeekMonthList(){
        return null;
    }


    @RequestMapping("ledgerDateList")
    public List<LedgerDto> ledgerDateList(@RequestBody Map<String, Object> map){

        String dateWithoutTime = String.valueOf(map.get("date")).substring(0, 10); // 시간 부분 제거
        LocalDate useDate = LocalDate.parse(dateWithoutTime, DateTimeFormatter.ofPattern("yyyy-MM-dd"));


        return ledgerService.findByUseDateBetween(useDate, Long.parseLong(String.valueOf(map.get("userNo"))))
                .stream()
                .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                .collect(Collectors.toList());
    }



    @RequestMapping("locationList")
    public List<LedgerDto> locationList(@RequestBody UserDto usersDto) {
        return ledgerService.findAllBylocation(modelMapper.map(usersDto, User.class))
                .stream()
                .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                .collect(Collectors.toList());
    }


    /**
     * @param ledgerDto
     * @return ledgerDto
     * @apiNote ledger 상세보기
     * Issue ledger.user , ledger.category, ledger.file 이 modelMapper로 객체 맴핑이 불가
     */
    @RequestMapping("ledgerDetail")
    public LedgerDto ledgerDetail(@RequestBody LedgerDto ledgerDto) {
        Ledger ledger = ledgerService.ledgerDetail(modelMapper.map(ledgerDto, Ledger.class));

//        System.out.println("ledger = " + ledger);

        ledgerDto = modelMapper.map(ledger, LedgerDto.class);
        ledgerDto.setUserDto(modelMapper.map(ledger.getUser(), UserDto.class));
        ledgerDto.setCategoryDto(modelMapper.map(ledger.getCategory(), CategoryDto.class));

        ledgerDto.setFilesDtoList(
                filesService.findByFileOwner(ledgerDto.getFileOwnerNo())
                        .stream()
                        .map(files -> modelMapper.map(files, FilesDto.class))
                        .toList()
        );

        return ledgerDto;
    }

    /**
     * @param ledgerDto
     * @return "false" , "success";
     * @apiNote ledger update를 하는 코드
     */
    @RequestMapping("ledgerItemUpdate")
    public String ledgerItemUpdate(@RequestBody LedgerDto ledgerDto) {


        Ledger ledger = modelMapper.map(ledgerDto, Ledger.class);

        ledger.setCategory(modelMapper.map(ledgerDto.getCategoryDto(), Category.class));

        int i = ledgerService.ledgerUpdate(ledger);

        return (i == 0) ? "false" : "success";
    }

    /**
     * @param ledgerDto
     * @apiNote ledgerDelete 하는 코드
     */

    @RequestMapping("ledgerDelete")
    public void ledgerDelete(@RequestBody LedgerDto ledgerDto) {
        ledgerService.ledgerDelete(modelMapper.map(ledgerDto, Ledger.class));
    }

    /**
     * @param fileList
     * @param fileOwnerNo
     * @throws Exception
     * @apiNote fileUtil을 사용하여 파일을 업로드하고 파일의 정보를 db에 저장
     */
    @RequestMapping("uploadFile")
    public void fileUpload(@RequestParam("file") List<MultipartFile> fileList, @RequestParam("fileOwnerNo") long fileOwnerNo) throws Exception {

        FileOwnerDto fileOwnerDto = modelMapper.map(ledgerService.findById(fileOwnerNo), FileOwnerDto.class);

        for (MultipartFile file : fileList) {
            String path = FileUtil.saveFileList(file, filePath);

            System.out.println("path = " + path);

            FilesDto filesDto = new FilesDto();

            filesDto.setFileOwnerDto(fileOwnerDto);
            filesDto.setFilePath(path);

            filesService.fileSave(modelMapper.map(filesDto, Files.class));
        }
    }

    /**
     * @param checkedList
     * @return "false" , "success";
     * @code fileOwnerNo의 정보를 받고 파일을 삭제 하는 코드
     */
    @RequestMapping("deleteFileItem")
    public String deleteFileItem(@RequestBody List<Long> checkedList) {
        int value = filesService.deleteFileItem(checkedList);

        String str = value != 0 ? "success" : "false";

        return str;
    }


    /**
     * @param ledgerDto
     * @apiNote ledger 와  fileOwnerNo가 같은 file 모두 삭제
     */
    @RequestMapping("deleteFile")
    public void deleteFile(@RequestBody LedgerDto ledgerDto) {
        FileOwner fileOwner = modelMapper.map(ledgerDto, FileOwner.class);

        filesService.deleteFile(fileOwner);
    }

    @RequestMapping("ledgerAllList")
    public List<LedgerDto> ledgerAllList(@RequestBody UserDto userDto) {

        List<Ledger> ledgers = ledgerService.ledgerAllList(modelMapper.map(userDto, User.class));

        return ledgers.stream().map(ledger -> modelMapper.map(ledger, LedgerDto.class)).collect(Collectors.toList());

    }

    @RequestMapping("ToDayLedger")
    public int ToDayLedger(@RequestBody UserDto userDto) {

        return ledgerService.TodayLedger(modelMapper.map(userDto, User.class));
    }


    public Map<String,List<?>> TranformMap(List<LedgerDto> ledgerDtoList, String type){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // List<LocalDateTime>을 Set<String>으로 변환합니다.
        Set<String> useDateSet = ledgerDtoList.stream()
                .map(ledger -> ledger.getUseDate().format(formatter))
                .sorted()
                .collect(Collectors.toCollection(LinkedHashSet::new)); //ledgerDtoList 의 useDate를 Set으로 변환

        Map<String, List<LedgerDto>> sortedMap;
        List<String> collect;

        Map<String, List<?>> ledgerMap = new HashMap<>();

        switch (type) {
            case "Day":
                // Map<String, List<Ledger>>를 생성하고 값 넣기
                sortedMap = useDateSet.stream()
                        .collect(Collectors.toMap(
                                s -> s,
                                s -> ledgerDtoList.stream()
                                        .filter(ledger -> ledger.getUseDate().format(formatter).equals(s))
                                        .peek(ledger -> {
                                            // 파일찾기 List => DtoList
                                            ledger.setFilesDtoList(
                                                    filesService.findByFileOwner(ledger.getFileOwnerNo())
                                                            .stream()
                                                            .map(files -> modelMapper.map(files, FilesDto.class))
                                                            .toList()
                                            );
                                        })
                                        .toList(),
                                (oldValue, newValue) -> newValue, // 병합 로직이 필요하지 않으므로 간단하게 newValue로 설정
                                TreeMap::new // 역순으로 정렬된 맵을 생성
                        ));


                collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();

                ledgerMap = collect.stream()
                        .collect(Collectors.toMap(
                                key -> key,
                                sortedMap::get,
                                (oldValue, newValue) -> newValue,
                                LinkedHashMap::new
                        ));
                break;
            case "Week":
                // Map<String, List<LedgerDto>>를 생성하고 값 넣기
                sortedMap = useDateSet.stream()
                        .collect(Collectors.groupingBy(
                                date -> {
                                    LocalDate startDate = LocalDate.parse(date, formatter) //파싱
                                            .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)); // 2024-02-12 + 6
                                    LocalDate endDate = startDate.plusDays(6); // 일주일 후의 일요일을 끝날로 설정 2024-02-18
                                    return startDate.format(formatter) + " ~ " + endDate.format(formatter); // 2024-02-12 ~ 2024-02-18
                                },
                                Collectors.flatMapping(
                                        //2024-02-12 ~ 2024-02-18 == (2024-02-15) Date -> ledgerDtoList.stream().filter(ledger -> ledger.getUseDate().format(formatter)=> (2024-02-15) .equals(date))
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

                collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();

                ledgerMap = collect.stream()
                        .collect(Collectors.toMap(
                                key -> key,
                                sortedMap::get,
                                (oldValue, newValue) -> newValue,
                                LinkedHashMap::new
                        ));
                break;


            case "Month":
                // Map<String, List<LedgerDto>>를 생성하고 값 넣기 (개월 단위로 그룹화)
                sortedMap = useDateSet.stream()
                        .collect(Collectors.groupingBy(
                                date ->{
                                    LocalDate startDate = LocalDate.from(LocalDate.parse(LocalDate.parse(date, formatter).with(TemporalAdjusters.firstDayOfMonth()).format(formatter)));
                                    LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
                                    return startDate.format(formatter) + " ~ " +  endDate.format(formatter);
                                },
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

                collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();

                ledgerMap = collect.stream()
                        .collect(Collectors.toMap(
                                key -> key,
                                sortedMap::get,
                                (oldValue, newValue) -> newValue,
                                LinkedHashMap::new
                        ));
            break;

            case "Month3" :
                // Map<String, List<LedgerDto>>를 생성하고 값 넣기 (3개월 단위로 그룹화)
                sortedMap = useDateSet.stream()
                        .collect(Collectors.groupingBy(
                                date -> {
                                    LocalDate startMonth = LocalDate.from(LocalDate.parse(date, formatter)
                                            .with(TemporalAdjusters.firstDayOfMonth()));

                                    return startMonth.format(formatter) + "~" + startMonth.plusMonths(2).format(formatter);
                                },
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

                collect = sortedMap.keySet().stream().sorted(Comparator.reverseOrder()).toList();

                ledgerMap = collect.stream()
                        .collect(Collectors.toMap(
                                key -> key,
                                sortedMap::get,
                                (oldValue, newValue) -> newValue,
                                LinkedHashMap::new
                        ));
            break;
        }

        System.out.println("ledgerMap = " + ledgerMap);

        return ledgerMap;
    }

    //일자별로 출금, 입금 계산
    public List<LedgerDto> sumPrice(List<LedgerDto> ledgerDtoList) {
        Map<String, LedgerDto> resultMap = new HashMap<>();

        for (LedgerDto ledgerDto : ledgerDtoList) {
            String key = ledgerDto.getUseDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            LedgerDto existingRecord = resultMap.getOrDefault(key, new LedgerDto());
            if (ledgerDto.getLedgerType() == LedgerType.SAVE) {
                existingRecord.setPrice(existingRecord.getPrice() + ledgerDto.getPrice());
                existingRecord.setLedgerType(LedgerType.SAVE);
            } else {
                existingRecord.setPrice2(existingRecord.getPrice2() + ledgerDto.getPrice());
                existingRecord.setLedgerType2(LedgerType.DEPOSIT);
            }
            existingRecord.setUseDate(ledgerDto.getUseDate());

            resultMap.put(key, existingRecord);
        }
        System.out.println("resultMap  = " + resultMap );
        return new ArrayList<>(resultMap.values());
    }


    private User toUser(UserDto userDto, Authentication authentication){
        User user = modelMapper.map(userDto, User.class);
        user.setUserNo(Long.parseLong(authentication.getName()));
        return user;
    }

    private User toUser(Authentication authentication){
        return User.builder().userNo(Long.parseLong(authentication.getName())).build();
    }

    private User toUser(UserDto userDto){
        return modelMapper.map(userDto, User.class);
    }

    private UserDto toUserDto(User user){
        return modelMapper.map(user, UserDto.class);
    }

}
