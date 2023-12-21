package org.nasdakgo.nasdak.Service;

import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

    public void deleteUser(){

    }

    public void logout(){

    }

}
