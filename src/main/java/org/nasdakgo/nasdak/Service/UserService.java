package org.nasdakgo.nasdak.Service;

import Utils.MailUtil;
import Utils.ValidationToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {

    private final UserRepository userRepository;
    private final MailUtil mailUtil;

    private final Map<String, ValidationToken> tokenMap = new HashMap<>();
    private final Map<String, String> signUpIdsMap = new HashMap<>();

    private final long minutesInMilli = 60*1000;

    public void setTempUser(User user){
        if(user.getPhone()==null){
            signUpIdsMap.put(user.getUserId(), user.getEmail());
        }else{
            signUpIdsMap.put(user.getUserId(), user.getPhone());
        }
    }

    public User signUp(User user){
        user.setRegDate(LocalDateTime.now());
        user.setActiveUser(true);
        user.setPushTime("23:00");
        return userRepository.save(user);
    }

    public void updateSNSUser(User user){
        userRepository.updateSNSUser(user.getUserNo(), user.getUserId(), user.getPassword());
    }

    public boolean canUseUserId(User user){
        User find = userRepository.findByUserId(user.getUserId());
        if(find!=null) return false;
        if(!signUpIdsMap.containsKey(user.getUserId())) return true;
        String tokenKey = signUpIdsMap.get(user.getUserId());
        if(!tokenMap.containsKey(tokenKey)) return true;
        ValidationToken token = tokenMap.get(tokenKey);
        return !token.validateTime();
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

    @Transactional
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

    @Scheduled(fixedDelay = minutesInMilli)
    public void executeMinuteSchedule(){
        LocalDateTime now = LocalDateTime.now();
        deleteExpiredToken(now);
        deleteExpiredIds(now);
    }

    public void deleteExpiredToken(LocalDateTime now){
        Iterator<Map.Entry<String, ValidationToken>> tokenIterator = tokenMap.entrySet().iterator();
        while (tokenIterator.hasNext()) {
            Map.Entry<String, ValidationToken> entry = tokenIterator.next();
            ValidationToken token = entry.getValue();

            if (!token.validateTime(now)) {
                tokenIterator.remove();
            }
        }
    }

    public void deleteExpiredIds(LocalDateTime now){
        Iterator<Map.Entry<String, String>> idIterator = signUpIdsMap.entrySet().iterator();
        while (idIterator.hasNext()) {
            Map.Entry<String, String> entry = idIterator.next();
            String tokenKey = entry.getValue();
            if(!tokenMap.containsKey(tokenKey)){
                idIterator.remove();
            }
        }
    }

    public void sendEmail(String email){
        String subject = "[nasdak] 이메일 인증 코드입니다.";
        StringBuilder body = new StringBuilder();
        String code = generateVerificationCode();
        body.append("[nasdak] 인증 번호 안내\n")
                .append("아래 인증코드를 복사하여 입력해주시기 바랍니다.\n")
                .append("인증코드 : ")
                .append(code);
        mailUtil.sendEmail(email, subject, body.toString());
//        log.info(body);
        ValidationToken token = new ValidationToken(code);
        tokenMap.put(email, token);
    }

    public boolean verifyEmail(String email, String code){
        ValidationToken token = tokenMap.get(email);
        return token!=null&&token.validateToken(code);
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
        ValidationToken token = new ValidationToken(code);
        tokenMap.put(phone, token);
    }

    public boolean verifyPhoneMessage(String phone, String code){
        ValidationToken token = tokenMap.get(phone);
        return token!=null&&token.validateToken(code);
    }

    public String generateVerificationCode(){
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
