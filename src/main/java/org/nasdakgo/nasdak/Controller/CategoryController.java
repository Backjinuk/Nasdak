package org.nasdakgo.nasdak.Controller;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.nasdakgo.nasdak.Dto.CategoryDto;
import org.nasdakgo.nasdak.Dto.UserDto;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Service.CategoryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category/")
public class CategoryController {

    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @RequestMapping("addCategory")
    public CategoryDto addCategory(@RequestBody CategoryDto categoryDto, Authentication authentication){
        Category category = toCategory(categoryDto, authentication);
        categoryService.addCategory(category);
        return toCategoryDto(category);
    }

    @RequestMapping("updateCategory")
    public void updateCategory(@RequestBody CategoryDto categoryDto, Authentication authentication){
        categoryService.updateContent(toCategory(categoryDto, authentication));
    }

    @RequestMapping("deleteCategory")
    public void deleteCategory(@RequestBody CategoryDto categoryDto, Authentication authentication){
        categoryService.deleteCategory(toCategory(categoryDto, authentication));
    }

    @RequestMapping("getCategoryList")
    public List<CategoryDto> getCategoryList(Authentication authentication){
        List<Category> categoryList = categoryService.getCategoryList(toUser(authentication));
        return toCategoryDtoList(categoryList);
    }

    @RequestMapping("integrateCategory")
    public void integrateCategory(@RequestBody Map<String, Object> map) {
        List<Object> list = (List<Object>) map.get("before");
        List<Long> before = new ArrayList<>();
        for (Object o : list) {
            before.add(Long.valueOf(o.toString()));
        }
        long after = Long.parseLong(map.get("after").toString());
        categoryService.integrateCategory(before, after);
    }

    ///////////////////////////////////////////////////////////////////////////

    private Category toCategory(CategoryDto categoryDto, Authentication authentication){
        Category category = modelMapper.map(categoryDto, Category.class);
        User user = User.builder().userNo(Long.parseLong(authentication.getName())).build();
        category.setUser(user);
        return category;
    }

    private Category toCategory(CategoryDto categoryDto){
        return modelMapper.map(categoryDto, Category.class);
    }

    private CategoryDto toCategoryDto(Category category){
        return modelMapper.map(category, CategoryDto.class);
    }

    private List<Category> toCategoryList(List<CategoryDto> categoryDtoList, Authentication authentication){
        List<Category> categoryList = new ArrayList<>();
        for (CategoryDto categoryDto : categoryDtoList) {
            categoryList.add(toCategory(categoryDto, authentication));
        }
        return categoryList;
    }

    private List<Category> toCategoryList(List<CategoryDto> categoryDtoList){
        List<Category> categoryList = new ArrayList<>();
        for (CategoryDto categoryDto : categoryDtoList) {
            categoryList.add(toCategory(categoryDto));
        }
        return categoryList;
    }

    private List<CategoryDto> toCategoryDtoList(List<Category> categoryList){
        List<CategoryDto> categoryDtoList = new ArrayList<>();
        for (Category category : categoryList) {
            categoryDtoList.add(toCategoryDto(category));
        }
        return categoryDtoList;
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
