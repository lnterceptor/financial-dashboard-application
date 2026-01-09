package com.example.financialdashboardapplicationbackend.controller;

import com.example.financialdashboardapplicationbackend.model.PasswordDto;
import com.example.financialdashboardapplicationbackend.model.User;
import com.example.financialdashboardapplicationbackend.model.UserDto;
import com.example.financialdashboardapplicationbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/profile")
public class UserController {
    UserService userService;

    @Autowired
    public UserController(UserService userService) {this.userService = userService;}

    @PostMapping("/changePassword")
    public ResponseEntity<?> ChangePassword(@RequestBody PasswordDto passwordDto){
        boolean passwordChanged = userService.changeUserPassword(passwordDto);
        if(!passwordChanged){
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Incorrect password"));
        }
        return ResponseEntity.ok(Map.of("Message","Password Changed"));
    }

    @PostMapping("/changeData")
    public ResponseEntity<?> ChangeData(@RequestBody UserDto userDto){
        User user = userService.changeUserData(userDto);
        if(user == null){
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(user);
    }
}
