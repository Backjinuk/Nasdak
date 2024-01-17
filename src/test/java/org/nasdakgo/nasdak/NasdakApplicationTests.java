package org.nasdakgo.nasdak;

import org.junit.jupiter.api.Test;
import org.nasdakgo.nasdak.Controller.UserController;
import org.nasdakgo.nasdak.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class NasdakApplicationTests {

    @Autowired
    private UserController userController;

    @Autowired
    private UserService userService;

    @Test
    void emailSend() {
        String email = "qrwrafsf@naver.com";
        userController.sendEmail(email);
    }

}
