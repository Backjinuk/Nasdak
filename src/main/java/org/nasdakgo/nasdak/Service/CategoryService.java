package org.nasdakgo.nasdak.Service;

import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.CategoryRepository;
import org.nasdakgo.nasdak.Repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import java.util.List;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:category.yml")
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final LedgerRepository ledgerRepository;

    @Value("${defaultCategories}")
    private String[] defaultCategories;

    public void saveDefaultCategory(User user) {
        List<Category> categoryList = new ArrayList<>();
        for (String defaultCategory : defaultCategories) {
            Category category = new Category();
            category.setContent(defaultCategory);
            category.setUser(user);
            category.setDelYn("N");
            categoryList.add(category);
        }
        categoryRepository.saveAll(categoryList);
    }

    public void addCategory(Category category){
        category.setDelYn("Y");
        categoryRepository.save(category);
    }

    public void updateContent(Category category){
        if(!isChangeable(category)){
            return;
        }
        categoryRepository.updateContent(category.getCategoryNo(), category.getContent());
    }

    public void deleteCategory(Category category){
        if(!isChangeable(category)){
            return;
        }
        Category after = categoryRepository.findDefaultCategory(category.getUser().getUserNo());
        ledgerRepository.moveCategoryToCategory(category, after);
        categoryRepository.delete(category);
    }

    public void integrateCategory(List<Category> before, Category after){
        if(!isChangeable(before)){
            return;
        }
        ledgerRepository.moveCategoryToCategory(before, after);
        categoryRepository.deleteAll(before);
    }

    public List<Category> getCategoryList(User user){
        return categoryRepository.findAllByUser_UserNo(user.getUserNo());
    }

    private boolean isChangeable(Category category){
        List<Category> categoryList = new ArrayList<>();
        categoryList.add(category);
        return isChangeable(categoryList);
    }

    private boolean isChangeable(List<Category> categoryList){
        return categoryRepository.countDelN(categoryList)==0;
    }

}
