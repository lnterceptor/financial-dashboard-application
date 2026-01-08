package com.example.financialdashboardapplicationbackend.service;


import com.example.financialdashboardapplicationbackend.model.Transaction;
import com.example.financialdashboardapplicationbackend.model.TransactionDto;
import com.example.financialdashboardapplicationbackend.repository.TransactionRepository;
import jakarta.persistence.Column;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;

@Service
public class TransactionService {
    TransactionRepository transactionRepository;

    @Autowired
    private TransactionService(TransactionRepository transactionRepository){
        this.transactionRepository = transactionRepository;
    }

    public ArrayList<TransactionDto> getUserTransactions(Long userId){
        ArrayList<Transaction> transactions = transactionRepository.findByUserId(userId);
        ArrayList<TransactionDto> transactionsDto = new ArrayList<>();
        for(Transaction transaction : transactions) {
            transactionsDto.add(TransactionDto.from(transaction));
        }
        return transactionsDto;
    }

    public TransactionDto addTransaction(TransactionDto transactionDto){
        Transaction transaction = new Transaction();

        transaction.setAmount(transactionDto.amount());
        transaction.setUserId(transactionDto.user_id());
        transaction.setDatedOfTransaction(transactionDto.date_of_transaction());
        transaction.setCategory(transactionDto.category());
        transaction.setDescription(transactionDto.description());

        transaction.setUpdatedAt(new Date());
        transaction.setCreatedAt(new Date());

        transactionRepository.save(transaction);
        return TransactionDto.from(transaction);
    }

    public TransactionDto editTransaction(TransactionDto transactionDto){
        Transaction transaction = transactionRepository.findById(transactionDto.id()).orElseThrow(() -> new RuntimeException("Couldn't find transaction"));

        transaction.setAmount(transactionDto.amount());
        transaction.setDatedOfTransaction(transactionDto.date_of_transaction());
        transaction.setCategory(transactionDto.category());
        transaction.setDescription(transactionDto.description());
        transaction.setUpdatedAt(new Date());

        transactionRepository.save(transaction);
        return TransactionDto.from(transaction);
    }
    public void deleteTransaction(Long id){
        transactionRepository.deleteById(id);
    }

    public Long getIncome(Long userId){
        ArrayList<Transaction> transactions = transactionRepository.findByUserId(userId);
        Long income = 0L;
        for (Transaction transaction: transactions) {
            if(transaction.getCategory().equals("INCOME")) {
                income += transaction.getAmount();
            }
        }
        return income;
    }

    public Long getExpenses(Long userId){
        ArrayList<Transaction> transactions = transactionRepository.findByUserId(userId);
        Long expenses = 0L;
        for (Transaction transaction: transactions) {
            if(!transaction.getCategory().equals("INCOME")) {
                expenses += transaction.getAmount();
            }
        }
        return expenses;
    }
}