package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.Files;
import org.nasdakgo.nasdak.Repository.FilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FilesService {

    FilesRepository filesRepository;

    @Autowired
    public FilesService(FilesRepository filesRepository){
        this.filesRepository = filesRepository;
    }


    public void fileSave(Files files) { filesRepository.save(files); }
}
