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

        //파일 업로드
        try {
            String fileName = String.valueOf(UUID.randomUUID()) +  file.getOriginalFilename();
            log.info("fileName : {}", fileName);
            File newFile = new File(filePath + "/" + fileName);
            log.info("newFile : {}" , newFile.getPath());

            // 디렉토리가 없을경우 디렉토리를 생성합니다.
            if (!newFile.getParentFile().exists()) {
                try{
                    newFile.getParentFile().mkdirs();
                    log.info("폴더가 생성되었습니다.");
                }
                catch(Exception e){
                    e.getStackTrace();
                }
            }else {
                log.info("이미 폴더가 생성되어 있습니다.");
            }

            //파일 전송
            file.transferTo(newFile);

            return fileName;

        }catch (Exception e){
            log.error("에러 : " + e.getMessage());
        }

        return null;
    }

    public static boolean deleteFile(String fileName, String filePath){
        File file = new File(filePath+"/"+fileName);
        return file.delete();
    }

}
