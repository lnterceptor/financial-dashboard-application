package com.example.financialdashboardapplicationbackend.model;

public record UserDto(Long id, String email, String username, String currency) {
    public static UserDto from(User user){
        return new UserDto(user.getId(), user.getEmail(), user.getUsername(), user.getCurrency());
    }
}