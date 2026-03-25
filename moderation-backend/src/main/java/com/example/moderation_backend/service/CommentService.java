package com.example.moderation_backend.service;

import org.springframework.stereotype.Service;

import com.example.moderation_backend.entity.Comment;
import com.example.moderation_backend.entity.Post;
import com.example.moderation_backend.entity.User;
import com.example.moderation_backend.repository.CommentRepository;
import com.example.moderation_backend.repository.PostRepository;
import com.example.moderation_backend.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModerationService moderationService;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository,
                          ModerationService moderationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.moderationService = moderationService;
    }

    public Comment createComment(Comment comment, Long postId, Long userId){

        String result = moderationService.moderate(comment.getText());
        if("REJECTED".equals(result)){
            throw new RuntimeException("Comment contains inappropriate content");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setPost(post);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public void deleteComment(Long id, Long authenticatedUserId){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        assertCommentOwner(comment, authenticatedUserId);
        commentRepository.deleteById(id);
    }
    public Comment updateComment(Long id, Comment updatedComment, Long authenticatedUserId){

    Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

    assertCommentOwner(comment, authenticatedUserId);

    comment.setText(updatedComment.getText());

    return commentRepository.save(comment);
}

    private void assertCommentOwner(Comment comment, Long authenticatedUserId) {
        // Why: Prevent one user from editing/deleting another user's comment.
        if (comment.getUser() == null || !comment.getUser().getId().equals(authenticatedUserId)) {
            throw new RuntimeException("You are not allowed to modify this comment");
        }
    }
}