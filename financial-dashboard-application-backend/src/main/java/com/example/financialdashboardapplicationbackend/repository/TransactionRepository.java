package com.example.financialdashboardapplicationbackend.repository;

import com.example.financialdashboardapplicationbackend.model.Transaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long> {
    ArrayList<Transaction> findByUserId(Long userId);
    Optional<Transaction> findById(Long id);
}
