package org.nasdakgo.nasdak.Service;

import Utils.Delay;
import Utils.MailUtil;
import Utils.ValidationToken;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {

    private final UserRepository userRepository;
    private final SchedulerService schedulerService;
    private final MailUtil mailUtil;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, ValidationToken> tokenMap = new HashMap<>();
    private final Map<String, String> signUpIdsMap = new HashMap<>();

    @PostConstruct
    public void initializeService(){
        List<User> userList = userRepository.findAllUserWithNotEncodedPassword();
        userList.forEach(user -> userRepository.updatePassword(user.getUserNo(), passwordEncoder.encode(user.getPassword())));
    }

    public void setTempUser(User user){
        signUpIdsMap.put(user.getAuthentication(), user.getUserId());
    }

    public User signUp(User user){
        if(userRepository.findByUserId(user.getUserId())!=null) throw new RuntimeException();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRegDate(LocalDateTime.now());
        user.setActiveUser(true);
        user.setPushTime("23:00");

        String key = user.getAuthentication();
        this.finishSignUp(key);

        return userRepository.save(user);
    }

    public void finishSignUp(String key){
        schedulerService.removeTimer(key);
        this.deleteSignUpMapData(key);
    }

    public void updateSNSUser(User user){
        userRepository.updateSNSUser(user.getUserNo(), user.getUserId(), passwordEncoder.encode(user.getPassword()));
    }

    public boolean canUseUserId(User user){
        User find = userRepository.findByUserId(user.getUserId());
        if(find!=null) return false;
        return !signUpIdsMap.containsValue(user.getUserId());
    }

    public User login(User user) {
        return userRepository.findByUserIdAndPassword(user.getUserId(), user.getPassword());
    }

    public User findId(User user){
        if(user.getPhone()==null){
            return this.findByEmail(user.getEmail());
        }else{
            return this.findByPhone(user.getPhone());
        }
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public User findByPhone(String phone){
        return userRepository.findByPhone(phone);
    }

    public User findPassword(User user){
        if(user.getPhone()==null){
            return userRepository.findByUserIdAndEmail(user.getUserId(), user.getEmail());
        }else{
            return userRepository.findByUserIdAndPhone(user.getUserId(), user.getPhone());
        }
    }

    public void updatePassword(User user){
        userRepository.updatePassword(user.getUserNo(), user.getPassword());
    }

    public User getUserInfo(User user){
        return userRepository.findById(user.getUserNo()).orElse(null);
    }

    public void updateUserInfo(User user){
        userRepository.updateUserInfo(user.getUserNo(), user.isSendKakaoTalk(), user.isSendWebPush());
    }

    public void updateEmail(User user){
        userRepository.updateEmail(user.getUserNo(), user.getEmail());
    }

    public void updatePhone(User user){
        userRepository.updatePhone(user.getUserNo(), user.getPhone());
    }

    public boolean isDuplicatedEmail(String email){
        return userRepository.findByEmail(email)!=null;
    }

    public boolean isDuplicatedPhone(String phone){
        return userRepository.findByPhone(phone)!=null;
    }

    public User findById(long userNo){
        return userRepository.findById(userNo).orElse(null);
    }

    public User findByIdWithSNSList(long userNo){
        return userRepository.findByIdWithSNSList(userNo).orElse(null);
    }

    public void deleteUser(User user){
        userRepository.deleteUser(user.getUserNo());
    }

    public void logout(){

    }

    public void uploadProfile(User user){
        userRepository.updateProfile(user.getUserNo(), user.getProfile());
    }

    public void deleteSignUpMapData(String key){
        tokenMap.remove(key);
        signUpIdsMap.remove(key);
    }

    public void sendEmail(String email){
        String subject = "[nasdak] 이메일 인증 코드입니다.";
        StringBuilder body = new StringBuilder();
        String code = generateVerificationCode();
        body.append("[nasdak] 인증 번호 안내\n")
                .append("아래 인증코드를 복사하여 입력해주시기 바랍니다.\n")
                .append("인증코드 : ")
                .append(code);
//        mailUtil.sendEmail(email, subject, body.toString());
        log.info(body);
        saveToken(email, code);
    }

    public void sendPhoneMessage(String phone){
        String subject = "[nasdak] 이메일 인증 코드입니다.";
        StringBuilder body = new StringBuilder();
        String code = generateVerificationCode();
        body.append("[nasdak] 인증 번호 안내\n")
                .append("아래 인증코드를 복사하여 입력해주시기 바랍니다.\n")
                .append("인증코드 : ")
                .append(code);
//        mailUtil.sendEmail(email, subject, body.toString());
        log.info(body);
        saveToken(phone, code);
    }

    private void saveToken(String key, String code){
        ValidationToken token = new ValidationToken(code);
        tokenMap.put(key, token);
        schedulerService.addTimer(key, ()->this.deleteSignUpMapData(key), Delay.ofMinutes(5));
    }

    public boolean verifyCode(String key, String code){
        ValidationToken token = tokenMap.get(key);
        boolean isValidate = token != null && token.validateToken(code);
        if(isValidate) {
            schedulerService.addTimer(key, ()->this.deleteSignUpMapData(key), Delay.ofMinutes(5));
        }
        return isValidate;
    }

    private String generateVerificationCode(){
        int length = 6;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++){
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }

        return sb.toString();
    }

}
