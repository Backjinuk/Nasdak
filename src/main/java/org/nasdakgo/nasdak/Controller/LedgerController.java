package org.nasdakgo.nasdak.Controller;

import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.CategoryDto;
import org.nasdakgo.nasdak.Dto.LedgerDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.LedgerService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ledger/")
public class LedgerController {

    @Autowired
    LedgerService ledgerService;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ModelMapper modelMapper;

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
        System.out.println("usersDto = " + usersDto);

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

        System.out.println("userNo.get() = " + ledgerDto.getUserNo());
        System.out.println("reg_date.get() = " + ledgerDto.getUseDate());

        return ledgerService.ledgerItem(String.valueOf(ledgerDto.getUseDate()), ledgerDto.getUserNo())
                .stream().map(ledger -> {
                    LedgerDto ledgerDto2 = modelMapper.map(ledger, LedgerDto.class);

                    //Entity를 Dto로 변환
                    ledgerDto2.setUserDto(modelMapper.map(ledger.getUser(), UserDto.class));
                    ledgerDto2.setCategoryDto(modelMapper.map(ledger.getCategory(), CategoryDto.class));

                    //Entity 초기화
                    ledgerDto2.setUser(null); ledgerDto2.setCategoryDto(null);

                    return ledgerDto2;
                })
                .collect(Collectors.toList());
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
        ledgerService.ledgerDelete(modelMapper.map(ledgerDto, Ledger.class));
    }
}
