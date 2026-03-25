package com.example.moderation_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moderation_backend.entity.Post;
import com.example.moderation_backend.service.PostService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // CREATE POST
    @PostMapping
    public Post createPost(@RequestBody Post post, HttpServletRequest request) {
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        return postService.createPost(post, authenticatedUserId);
    }

    // GET ALL POSTS
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // UPDATE POST
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post post, HttpServletRequest request) {
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        return postService.updatePost(id, post.getContent(), authenticatedUserId);
    }

    // DELETE POST
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id, HttpServletRequest request) {
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        postService.deletePost(id, authenticatedUserId);
    }

    // TOGGLE LIKE
    @PostMapping("/{id}/like")
    public Post toggleLike(@PathVariable Long id, HttpServletRequest request) {
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        return postService.toggleLike(id, authenticatedUserId);
    }
}