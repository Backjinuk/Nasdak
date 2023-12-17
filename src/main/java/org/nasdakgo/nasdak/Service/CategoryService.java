package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }


    public void save(Category category) { categoryRepository.save(category);
    }


    public Category findById(long categoryNo) { return categoryRepository.findById(categoryNo).get();
    }

    public List<Category> categoryUserList(Category category) {
        return categoryRepository.categoryUserList(category.getUser().getUserNo());
    }
}
