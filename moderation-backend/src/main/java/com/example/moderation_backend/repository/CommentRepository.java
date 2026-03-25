package com.example.moderation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moderation_backend.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}