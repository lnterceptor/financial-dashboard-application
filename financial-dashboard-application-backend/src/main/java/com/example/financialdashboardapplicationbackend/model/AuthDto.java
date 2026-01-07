package com.example.financialdashboardapplicationbackend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthDto(
    @NotBlank String email,
    @NotBlank @Size(min=6) String username,
    @NotBlank @Size(min=8) String password,
    @NotBlank @Size(min=8) String repeatPassword
) {}
