package com.example.financialdashboardapplicationbackend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordDto (
    @NotBlank long userId,
    @NotBlank @Size(min=8) String password,
    @NotBlank @Size(min=8) String repeatPassword
){}
