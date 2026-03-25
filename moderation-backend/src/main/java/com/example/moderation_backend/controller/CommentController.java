package com.example.moderation_backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moderation_backend.entity.Comment;
import com.example.moderation_backend.service.CommentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Comment createComment(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Comment comment = new Comment();
        comment.setText((String) body.get("text"));

        @SuppressWarnings("unchecked")
        Map<String, Object> postMap = (Map<String, Object>) body.get("post");
        Long postId = ((Number) postMap.get("id")).longValue();

        // Why: Never trust user id from request body; use authenticated id from validated token.
        Long userId = (Long) request.getAttribute("authenticatedUserId");

        return commentService.createComment(comment, postId, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id, HttpServletRequest request){
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        commentService.deleteComment(id, authenticatedUserId);
    }
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment updatedComment, HttpServletRequest request){
        Long authenticatedUserId = (Long) request.getAttribute("authenticatedUserId");
        return commentService.updateComment(id, updatedComment, authenticatedUserId);
    }
}