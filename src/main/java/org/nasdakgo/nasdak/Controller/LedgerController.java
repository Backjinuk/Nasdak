package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.*;
import org.nasdakgo.nasdak.Entity.*;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.FilesService;
import org.nasdakgo.nasdak.Service.LedgerService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
public class LedgerController {

    LedgerService ledgerService;

    UserService userService;

    CategoryService categoryService;

    FilesService filesService;

    ModelMapper modelMapper;

    @Value("${upload.file.path}")
    String filePath;

    @Autowired
    public LedgerController(LedgerService ledgerService, UserService userService,
                            CategoryService  categoryService, ModelMapper modelMapper
                            , FilesService filesService){
        this.ledgerService = ledgerService;
        this.userService = userService;
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
        this.filesService = filesService;
    }

    @RequestMapping("ledgerSave")
    public LedgerDto ledgerSave(@RequestBody Map<String, LedgerDto> requestData) {
        System.out.println("ledgerDto = " + requestData.get("LedgerDto"));

        Ledger ledger = modelMapper.map(requestData.get("LedgerDto"), Ledger.class);

        // 기존의 User와 Category를 참조하여 설정
        ledger.setUser(userService.findById(requestData.get("LedgerDto").getUserDto().getUserNo()));
        ledger.setCategory(categoryService.findById(requestData.get("LedgerDto").getCategoryDto().getCategoryNo()));

        ledgerService.save(ledger);

        return modelMapper.map(ledger, LedgerDto.class);

    }

    @RequestMapping("LedgerList")
    public List<?> LedgerList(@RequestBody UserDto usersDto){

        return ledgerService.findAllByUsers(usersDto.getUserNo());
//                .stream().map(ledger -> {
//                    LedgerDto ledgerDto = modelMapper.map(ledger, LedgerDto.class);
//
//                    //Entity를 Dto로 변환
//                    ledgerDto.setUsersDto(modelMapper.map(ledger.getUsers(), UsersDto.class));
//                    ledgerDto.setCategoryDto(modelMapper.map(ledger.getCategory(), CategoryDto.class));
//
//                    //Entity 초기화
//                    ledgerDto.setUsers(null); ledgerDto.setCategoryDto(null);
//
//                    return ledgerDto;
//                })
//                .collect(Collectors.toList());
    }
    @RequestMapping("ledgerItem")
    public List<LedgerDto> ledgerItem(@RequestBody LedgerDto ledgerDto) {
        return ledgerService.ledgerItem(String.valueOf(ledgerDto.getRegDate2()), ledgerDto.getUserNo())
                .stream()
                .map(ledger -> {
                    LedgerDto ledgerDto2 = modelMapper.map(ledger, LedgerDto.class);

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


    @RequestMapping("ledgerDetail")
    public LedgerDto ledgerDetail(@RequestBody LedgerDto ledgerDto){
        Ledger ledger = ledgerService.ledgerDetail(modelMapper.map(ledgerDto, Ledger.class));

        System.out.println("ledger = " + ledger);

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

    @RequestMapping("ledgerItemUpdate")
    public String ledgerItemUpdate(@RequestBody LedgerDto ledgerDto){
        

        Ledger ledger = modelMapper.map(ledgerDto, Ledger.class);

        ledger.setCategory(modelMapper.map(ledgerDto.getCategoryDto(), Category.class));

        System.out.println("ledger = " + ledger.getLedgerType());

        int i = ledgerService.ledgerUpdate(modelMapper.map(ledgerDto, Ledger.class));

        return (i == 0) ? "false" : "success";
    }

    @RequestMapping("ledgerDelete")
    public void ledgerDelete(@RequestBody LedgerDto ledgerDto){
        ledgerService.ledgerDelete(modelMapper.map(ledgerDto, Ledger.class));
    }


    @RequestMapping("uploadFile")
        public void fileUpload(@RequestParam("file")List<MultipartFile> fileList, @RequestParam("fileOwnerNo")long fileOwnerNo) throws Exception {

        FileOwnerDto fileOwnerDto = modelMapper.map(ledgerService.findById(fileOwnerNo), FileOwnerDto.class);

        for(MultipartFile file : fileList){
            String path = FileUtil.saveFileList(file, filePath);

            System.out.println("path = " + path);

            FilesDto filesDto = new FilesDto();

            filesDto.setFileOwnerDto(fileOwnerDto);
            filesDto.setFilePath(path);

            filesService.fileSave(modelMapper.map(filesDto, Files.class));
        }
    }

    @RequestMapping("deleteFile")
    public void deleteFile(@RequestBody LedgerDto ledgerDto){
        FileOwner fileOwner = modelMapper.map(ledgerDto, FileOwner.class);

        filesService.deleteFile(fileOwner);
    }



}
