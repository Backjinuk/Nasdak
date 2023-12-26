package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
//@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
        userRepository.initializeUserSendKakaoTalk();
        userRepository.initializeUserSendWebPush();
    }

    public User signUp(User user){
        user.setRegDate(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User searchUserId(User user){
        return userRepository.findByUserId(user.getUserId());
    }

    public User login(User user) {
        return userRepository.findByUserIdAndPassword(user.getUserId(), user.getPassword());
    }

    public User findId(User user){
        if(user.getPhone()==null){
            return userRepository.findByEmail(user.getEmail());
        }else{
            return userRepository.findByPhone(user.getPhone());
        }
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
        userRepository.save(user);
    }

    public void updateAuth(User user){
        userRepository.updateAuth(user.getUserNo(), user.getEmail(), user.getPhone());
    }

    public User findById(long userNo){
        return userRepository.findById(userNo).orElse(null);
    }

    public void deleteUser(){

    }

    public void logout(){

    }

    public void uploadProfile(User user){
        userRepository.updateProfile(user.getUserNo(), user.getProfile());
    }

}
