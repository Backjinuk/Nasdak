package org.nasdakgo.nasdak.Service;

import jakarta.transaction.Transactional;
import org.nasdakgo.nasdak.Entity.FileOwner;
import org.nasdakgo.nasdak.Entity.Files;
import org.nasdakgo.nasdak.Repository.FilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilesService {

    FilesRepository filesRepository;

    @Autowired
    public FilesService(FilesRepository filesRepository){
        this.filesRepository = filesRepository;
    }


    public void fileSave(Files files) { filesRepository.save(files); }

    @Transactional
    public void deleteFile(FileOwner fileOwner) { filesRepository.deleteByFileOwner(fileOwner);
    }

    public List<Files> findByFileOwner(long fileOwner) { return filesRepository.findByFileOwner(fileOwner);
    }
}
