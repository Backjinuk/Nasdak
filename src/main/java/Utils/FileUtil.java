package Utils;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Slf4j
@Service
public class FileUtil {

    public static String saveFileList(MultipartFile file,String filePath)throws Exception{

            try {
                String fileName = String.valueOf(UUID.randomUUID()) +  file.getOriginalFilename();
                log.info("fileNmae : {}", fileName);
                File newFile = new File(filePath + "/" + fileName);
                log.info("newFile : {}" , newFile.getPath());
                file.transferTo(newFile);

                return newFile.getPath();

            }catch (Exception e){
                log.error("에러 : " + e.getMessage());
            }

            return null;
    }
}
