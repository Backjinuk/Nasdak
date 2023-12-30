package org.nasdakgo.nasdak.Service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.CategoryRepository;
import org.nasdakgo.nasdak.Repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final LedgerRepository ledgerRepository;

    @Value("${defaultCategories}")
    private String[] defaultCategories;

    @PostConstruct
    public void asdf(){
        for (String defaultCategory : defaultCategories) {
            System.out.println("defaultCategory = " + defaultCategory);
        }
    }

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
        ledgerRepository.moveCategoryToCategory(category.getCategoryNo(), after.getCategoryNo());
        categoryRepository.delete(category);
    }

    public void integrateCategory(List<Long> before, long after){
        if(!isChangeable(before)){
            return;
        }
        ledgerRepository.moveCategoryToCategory(before, after);
        categoryRepository.deleteAllById(before);
    }

    public List<Category> getCategoryList(User user){
        return categoryRepository.findAllByUser_UserNo(user.getUserNo());
    }

    public Category findById(long categoryNo){
        return categoryRepository.findById(categoryNo).orElse(null);
    }

    private boolean isChangeable(Category category){
        List<Long> categoryNoList = new ArrayList<>();
        categoryNoList.add(category.getCategoryNo());
        return isChangeable(categoryNoList);
    }

    private boolean isChangeable(long categoryNo){
        List<Long> categoryNoList = new ArrayList<>();
        categoryNoList.add(categoryNo);
        return isChangeable(categoryNoList);
    }

    private boolean isChangeable(List<Long> categoryNoList){
        return categoryRepository.countDelN(categoryNoList)==0;
    }



}
