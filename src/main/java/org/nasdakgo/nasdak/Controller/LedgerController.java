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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    @RequestMapping("LedgerList")
    public List<?> LedgerList(@RequestBody UserDto usersDto) {
        List<?> allByUsers = ledgerService.findAllByUsers(usersDto.getUserNo());
        System.out.println("allByUsers = " + allByUsers);
        return allByUsers;

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
     * @return List<LedgerDto>
     * @apiNote LedgerList 에서 가지고오는 날짜로 ledger의 정보를 가지고오는 기능
     */
    @RequestMapping("ledgerItem")
    public List<LedgerDto> ledgerItem(@RequestBody LedgerDto ledgerDto) {
        return ledgerService.ledgerItem(String.valueOf(ledgerDto.getRegDate2()), ledgerDto.getUserNo())
                .stream()
                .map(ledger -> {

                    LedgerDto ledgerDto2 = modelMapper.map(ledger, LedgerDto.class);

//                    if(ledger.getFilesList().size()>0)
//                    System.out.println("ledger.getFilesList().get(0) = " + ledger.getFilesList().get(0));

                    // 파일찾기 List => DtoList
                    ledgerDto2.setFilesDtoList(
                            filesService.findByFileOwner(ledger.getFileOwnerNo())
                                    .stream()
                                    .map(files -> modelMapper.map(files, FilesDto.class))
                                    .toList()
                    );

                    // Entity를 Dto로 변환
                    Optional.ofNullable(ledger.getUser()).map(user -> modelMapper.map(user, UserDto.class)).ifPresent(ledgerDto2::setUserDto);
                    Optional.ofNullable(ledger.getCategory()).map(category -> modelMapper.map(category, CategoryDto.class)).ifPresent(ledgerDto2::setCategoryDto);

                    return ledgerDto2;
                })
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
}
