package com.example.financialdashboardapplicationbackend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="transactions")
public class Transaction {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "transactions_id_seq")
    @SequenceGenerator(
            name = "transactions_id_seq",
            sequenceName = "transactions_id_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long amount;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, name = "date_of_transaction")
    private Date datedOfTransaction;

    @Column
    private String description;

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getAmount() {
        return amount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public String getCategory() {
        return category;
    }

    public Date getDatedOfTransaction() {
        return datedOfTransaction;
    }

    public String getDescription() {
        return description;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDatedOfTransaction(Date datedOfTransaction) {
        this.datedOfTransaction = datedOfTransaction;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
