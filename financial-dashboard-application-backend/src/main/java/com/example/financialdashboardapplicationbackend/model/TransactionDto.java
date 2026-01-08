package com.example.financialdashboardapplicationbackend.model;

import java.util.Date;

public record TransactionDto (Long id, Long amount, String category, Long user_id, Date date_of_transaction, String description) {
    public static TransactionDto from(Transaction transaction){
       return new TransactionDto(transaction.getId(), transaction.getAmount(), transaction.getCategory(), transaction.getUserId(), transaction.getDatedOfTransaction(), transaction.getDescription());
    }
}


