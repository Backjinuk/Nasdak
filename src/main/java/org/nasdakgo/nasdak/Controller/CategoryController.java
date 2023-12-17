package org.nasdakgo.nasdak.Controller;

import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.CategoryDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/category/")
public class CategoryController {

    CategoryService categoryService;

    UserService userService;

    ModelMapper modelMapper;

    @Autowired
    public CategoryController(CategoryService categoryService, UserService userService, ModelMapper modelMapper){
        this.categoryService = categoryService;
        this.userService =  userService;
        this.modelMapper = modelMapper;
    }


    @RequestMapping("basicCategory")
    public void basicCategory(@RequestBody UserDto usersDto){
        String[] strArray = {"여행", "취미", "식당", "가전", "기타"};

        System.out.println("usersDto = " + usersDto);

        User users = userService.searchUserId(usersDto.getUserId());

        CategoryDto categoryDto = new CategoryDto();
        for (int i = 0; i < strArray.length; i++) {
            categoryDto.setUserDto(modelMapper.map(users, UserDto.class));
            categoryDto.setContent(strArray[i]);
            categoryService.save(modelMapper.map(categoryDto, Category.class));
        }
    }
}
