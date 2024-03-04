package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
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
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ledger/")
@RequiredArgsConstructor
@Slf4j
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
        String prevNext = (Objects.equals(String.valueOf(map.get("type")), "")) ? "first" : String.valueOf(map.get("type"));
        long userNo = Long.parseLong(String.valueOf(toUser(authentication).getUserNo()));
        Map<String, List<?>> stringListMap = new HashMap<>();



        if(searchKey.equals("Day")) { // 일별 조회

            int startPage = (map.get("startPage") == null) ? 0 : Integer.parseInt(String.valueOf(map.get("startPage")));
            int endPage = (map.get("endPage") == null) ? 5 : Integer.parseInt(String.valueOf(map.get("endPage")));

            List<String> allByUsers = new ArrayList<>();

            if(Integer.parseInt(String.valueOf(map.get("endPage"))) > 0 ){
                allByUsers = ledgerService.findAllByUsers(userNo, startPage, endPage);
            }

            if (allByUsers.isEmpty()) {
                return new HashMap<>();
            }

            allByUsers2 = ledgerService.ledgerItem(allByUsers.get(allByUsers.size() - 1), allByUsers.get(0), userNo)
                    .stream()
                    .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                    .collect(Collectors.toList());

            stringListMap = TranformMap(allByUsers2, searchKey); // 3개의 날짜 그룹 생성

        } else  { // 주, 월, 3개월 조회

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDate startDate = (Objects.equals(String.valueOf(map.get("startDate")), "")) ? LocalDate.now() : LocalDate.parse(String.valueOf(map.get("startDate")), formatter).atStartOfDay().toLocalDate();
            LocalDate endDate = null;

            Map<String, Object> dateMap = searchDate(prevNext, searchKey, startDate, endDate);

            allByUsers2 = ledgerService.getLedgerList(LocalDate.parse((String) dateMap.get("startDate")), LocalDate.parse((String) dateMap.get("endDate")), userNo)
                                        .stream()
                                        .map(ledger -> modelMapper.map(ledger, LedgerDto.class))  // Ledger를 LedgerDto로 변환
                                        .collect(Collectors.toList());  // LedgerDtoList를 조회

            stringListMap = TranformMap(allByUsers2, searchKey); // 3개의 날짜 그룹 생성

            if(stringListMap.keySet().size() <= 3){ // 3개의 날짜 그룹이 안되면 추가 조회
                while (stringListMap.keySet().size() < 3) { // 그룹이 3개가 될때까지 조회

                    List<String> keys = new ArrayList<>(); // 키값을 담을 리스트
                    String lastKey = ""; // 마지막 키값
                    LocalDate keyDate = LocalDate.now(); // stringListMap이 비어있을때 기본값

                    if(!stringListMap.keySet().isEmpty()){ // stringListMap이 비어있지 않다면 마지막 키값을 parsing
                        keys = new ArrayList<>(stringListMap.keySet());
                        lastKey = keys.get(keys.size() - 1);
                        keyDate = LocalDate.parse(lastKey.split("~")[0].trim());
                    }


                    LocalDateTime ledgerSearchDate = ledgerService.getLedgerSearchDate(keyDate, userNo); // 재조정된 날짜를 기반으로 가장 최근의 데이터가 있는 날짜를 조회

                    if (ledgerSearchDate == null || String.valueOf(ledgerSearchDate).isEmpty()) {
                        log.info("더이상 조회할 데이터가 없습니다.");
                        break;
                    }


                    Map<String, Object> searchMap = searchDate("OneDay", searchKey, LocalDate.from(ledgerSearchDate), LocalDate.from(ledgerSearchDate));// 재조정된 날짜로 검색조건 재설정

                    List<LedgerDto> collect = ledgerService.getLedgerList(LocalDate.parse(String.valueOf(searchMap.get("startDate"))), // 재조정된 값으로 데이터 조회
                                                                            LocalDate.parse(String.valueOf(searchMap.get("endDate"))),
                                                                            userNo)
                                                            .stream()
                                                            .map(ledger -> modelMapper.map(ledger, LedgerDto.class))
                                                            .collect(Collectors.toList());

                    Map<String, List<?>> tempStringListMap = TranformMap(collect, searchKey); // 재조정된 데이터로 새로운 temp 그룹 생성

                    for (String key : tempStringListMap.keySet()) { // temp 그룹을 기존 그룹에 추가
                        if (!stringListMap.containsKey(key)) {
                            stringListMap.putAll(tempStringListMap);
                            break;
                        }
                    }
                }
            }
        }

        return stringListMap;
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

    public Map<String, Object> searchDate(String prevNext,String searchKey, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> map = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if(prevNext.equals("first")){ // 처음 조회
            switch (searchKey) {
                case "Week":
                    startDate =  startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusDays(7);
                    endDate   =  startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).plusDays(13);
                    break;
                case "Month":
                    startDate = startDate.with(TemporalAdjusters.firstDayOfMonth());
                    endDate   = startDate.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "Month3":
                    startDate = startDate.with(TemporalAdjusters.firstDayOfMonth()).plusMonths(2);
                    endDate   = startDate.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                default:
                    break;
            }
        }

        if(prevNext.equals("OneDay")){ // 일별 조회
            switch (searchKey) {
                case "Week":
                    startDate =  startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                    endDate   =  startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).plusDays(7);
                    break;
                case "Month":
                    startDate = startDate.with(TemporalAdjusters.firstDayOfMonth());
                    endDate   = startDate.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "Month3":
                    startDate = startDate.with(TemporalAdjusters.firstDayOfMonth()).plusMonths(2);
                    endDate   = startDate.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                default:
                    break;
            }
        }

        if(prevNext.equals("NEXT")){ // 페이징 조회
            endDate = switch (searchKey) { // 날짜 재구성
                case "Week" -> {
                    startDate = startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusDays(13);
                    yield startDate.plusDays(7);
                }
                case "Month" -> {
                    startDate = Objects.requireNonNull(startDate).plusMonths(1);
                    yield startDate.plusMonths(1);
                }
                case "Month3" -> {
                    startDate = Objects.requireNonNull(startDate).plusMonths(3);
                    yield startDate.plusMonths(3);
                }
                default -> endDate;
            };
        }

        if(prevNext.equals("ROOF")){ // 페이징 조회
            endDate = switch (searchKey) { // 날짜 재구성
                case "Week" -> {
                    startDate = startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusDays(13);
                    yield startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).plusDays(14);
                }
                case "Month" -> {
                    startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusDays(1);
                    yield startDate.plusMonths(1);
                }
                case "Month3" -> {
                    startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusDays(3);
                    yield startDate.plusMonths(3);
                }
                default -> endDate;
            };
        }


        map.put("startDate", startDate.format(formatter));
        map.put("endDate", endDate.format(formatter));

        return map;
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
