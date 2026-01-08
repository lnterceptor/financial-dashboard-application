package com.example.financialdashboardapplicationbackend.controller;

import com.example.financialdashboardapplicationbackend.model.Transaction;
import com.example.financialdashboardapplicationbackend.model.TransactionDto;
import com.example.financialdashboardapplicationbackend.model.UserDto;
import com.example.financialdashboardapplicationbackend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/transactions")
public class TransactionController {
    TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService){
        this.transactionService = transactionService;
    }

    @GetMapping("/userTransactions/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long userId){
        ArrayList<TransactionDto>transactionsDto = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactionsDto);
    }

    @PostMapping("/addTransaction")
    public  ResponseEntity<?> addTransaction(@RequestBody TransactionDto transactionDto){
        TransactionDto transactionDto2 = transactionService.addTransaction(transactionDto);
        return transactionDto2 == null ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")) : ResponseEntity.ok(transactionDto2);
    }

    @PostMapping("/editTransaction")
    public ResponseEntity<?> editTransaction(@RequestBody TransactionDto transactionDto){
        TransactionDto transactionDto2 = transactionService.editTransaction(transactionDto);
        return transactionDto2 == null ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")) : ResponseEntity.ok(transactionDto2);
    }

    @DeleteMapping("/deleteTransaction/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id){
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getIncome/{userId}")
    public ResponseEntity<?> getIncome(@PathVariable Long userId){
        return ResponseEntity.ok(transactionService.getIncome(userId));
    }

    @GetMapping("/getExpenses/{userId}")
    public ResponseEntity<?> getExpenses(@PathVariable Long userId){
        return ResponseEntity.ok(transactionService.getExpenses(userId));
    }
}
