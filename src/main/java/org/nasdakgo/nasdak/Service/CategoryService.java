package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }


    public void save(Category category) { categoryRepository.save(category);
    }
}
