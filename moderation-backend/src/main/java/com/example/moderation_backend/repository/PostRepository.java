package com.example.moderation_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moderation_backend.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}