package com.example.financialdashboardapplicationbackend.service;

import com.example.financialdashboardapplicationbackend.model.AuthDto;
import com.example.financialdashboardapplicationbackend.model.User;
import com.example.financialdashboardapplicationbackend.model.UserDto;
import com.example.financialdashboardapplicationbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.util.Date;

@Service
public class UserService {
    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public UserDto createUser(AuthDto authDto){
        if(!validateRegister(authDto)){
            return null;
        }
        User user = setUser(authDto);
        userRepository.save(user);

        return UserDto.from(user);
    }

    private boolean validateRegister(AuthDto authDto){
        if(!authDto.password().equals(authDto.repeatPassword())){
            return false;
        }
        User user = userRepository.findByEmail(authDto.email()).orElse(null);
        if(user != null){
            return false;
        }
        user = userRepository.findByUsername(authDto.email()).orElse(null);
        return user == null;
    }

    private User setUser(AuthDto authDto) {
        User user = new User();
        user.setUsername(authDto.username());
        user.setEmail(authDto.email());
        try {
            String hash = java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(authDto.password().getBytes())).toLowerCase();
            user.setPassword(hash);
        }catch (Exception e){
            System.out.println(e);
            return null;
        }
        user.setCreatedAt(new Date());
        user.setCurrency("USD");
        return user;
    }


    public User signInUser(AuthDto authDto){
        User user = userRepository.findByUsername(authDto.username()).orElse(userRepository.findByEmail(authDto.email()).orElse(null));
        String password = "";
        try {
            password = java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(authDto.password().getBytes())).toLowerCase();
        }catch (Exception e){
            System.out.println(e);
            return null;
        }
        return user == null ? null : user.getPassword().equals(password) ? user : null;
    }
}
