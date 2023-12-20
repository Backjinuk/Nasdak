package org.nasdakgo.nasdak.Controller;

import Utils.FileUtil;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.*;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.Files;
import org.nasdakgo.nasdak.Entity.Ledger;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
        LedgerDto ledgerDto= modelMapper.map(requestData.get("LedgerDto"), LedgerDto.class);

       ledgerDto.setUser(userService.findById(ledgerDto.getUserDto().getUserNo()));

       ledgerDto.setCategory(categoryService.findById(ledgerDto.getCategoryDto().getCategoryNo()));

        Ledger ledger = ledgerService.save(modelMapper.map(requestData.get("LedgerDto"), Ledger.class));
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
                .stream().map(ledger -> {

                    Hibernate.initialize(ledger.getUser());
                    Hibernate.initialize(ledger.getCategory());

                    LedgerDto ledgerDto2 = modelMapper.map(ledger, LedgerDto.class);

                    // Entity를 Dto로 변환
                    ledgerDto2.setUserDto(modelMapper.map(ledger.getUser(), UserDto.class));
                    ledgerDto2.setCategoryDto(modelMapper.map(ledger.getCategory(), CategoryDto.class));

                    // Entity 초기화
                    ledgerDto2.setUser(null);
                    ledgerDto2.setCategoryDto(null);

                    return ledgerDto2;

                }).collect(Collectors.toList());
    }


    @RequestMapping("ledgerDetail")
    public LedgerDto ledgerDetail(@RequestBody LedgerDto ledgerDto){
        Ledger ledger = ledgerService.ledgerDetail(modelMapper.map(ledgerDto, Ledger.class));

        ledgerDto = modelMapper.map(ledger, LedgerDto.class);

        ledgerDto.setCategoryDto(modelMapper.map(ledgerDto.getCategory(), CategoryDto.class));
        ledgerDto.setUserDto(modelMapper.map(ledgerDto.getUser(), UserDto.class));
        ledgerDto.setCategory(null); ledgerDto.setUser(null);



        return ledgerDto;
    }

    @RequestMapping("ledgerItemUpdate")
    public String ledgerItemUpdate(@RequestBody LedgerDto ledgerDto){
        
        Map<String, Objects> map = new HashMap<>();
        ledgerDto.setCategory(modelMapper.map(ledgerDto.getCategoryDto(), Category.class));

        int i = ledgerService.ledgerUpdate(modelMapper.map(ledgerDto, Ledger.class));

        return (i == 0) ? "false" : "success";
    }

    @RequestMapping("ledgerDelete")
    public void ledgerDelete(@RequestBody LedgerDto ledgerDto){

        System.out.println("ledgerDto = " + ledgerDto);
        ledgerService.ledgerDelete(modelMapper.map(ledgerDto, Ledger.class));
    }


    @RequestMapping("uploadFile")
        public void fileUpload(@RequestParam("file")List<MultipartFile> fileList, @RequestParam("fileOwnerNo")long fileOwnerNo) throws Exception {

        System.out.println("도착했습니다.");

        FileOwnerDto fileOwnerDto = modelMapper.map(ledgerService.findById(fileOwnerNo), FileOwnerDto.class);

        System.out.println("filePath = " +         filePath);


        for(MultipartFile file : fileList){
            String path = FileUtil.saveFileList(file, filePath);

            FilesDto filesDto = new FilesDto();

            filesDto.setFileOwnerDto(fileOwnerDto);
            filesDto.setFilePath(path);

            filesService.fileSave(modelMapper.map(filesDto, Files.class));
        }
    }
}
