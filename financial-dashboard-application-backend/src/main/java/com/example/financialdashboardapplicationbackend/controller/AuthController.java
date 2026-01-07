package com.example.financialdashboardapplicationbackend.controller;

import com.example.financialdashboardapplicationbackend.model.AuthDto;
import com.example.financialdashboardapplicationbackend.model.User;
import com.example.financialdashboardapplicationbackend.model.UserDto;
import com.example.financialdashboardapplicationbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthController {
    UserService userService;

    @Autowired
    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthDto authDto){
        System.out.println(authDto);
        if(!authDto.password().equals(authDto.repeatPassword())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Passwords do not match"));
        }
        UserDto userDto = userService.createUser(authDto);

        return userDto != null ? ResponseEntity.ok(userDto) : ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User with given username or email already exists"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> signInUser(@RequestBody AuthDto authDto){
        User user = userService.signInUser(authDto);
        if(user == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User doesn't exist"));
        }
        return ResponseEntity.ok(UserDto.from(user));
    }
}
