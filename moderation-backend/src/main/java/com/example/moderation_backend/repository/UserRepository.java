package com.example.moderation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moderation_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

    User findByEmail(String email);

    User findByUsername(String username);

}