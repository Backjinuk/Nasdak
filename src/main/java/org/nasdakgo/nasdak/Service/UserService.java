package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User userJoin(User users){
        return userRepository.save(users);
    }

    public void userUpdate(User user) { userRepository.userUpdate(user.getUserNo(), user.getEmail(), user.getPhone()); }

    public User findById(long userNo) {
        return userRepository.findById(userNo).get();
    }

    public User searchUserId(String userId){return userRepository.findByUserId(userId); }


    public User userLogin(User users) { return userRepository.userLogin(users.getUserId(), users.getPassword());
    }
}
