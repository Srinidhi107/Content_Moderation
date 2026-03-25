package com.example.moderation_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.moderation_backend.entity.Post;
import com.example.moderation_backend.entity.User;
import com.example.moderation_backend.repository.PostRepository;
import com.example.moderation_backend.repository.UserRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModerationService moderationService;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       ModerationService moderationService){
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.moderationService = moderationService;
    }

    // CREATE POST
    public Post createPost(Post post, Long authenticatedUserId){

        String result = moderationService.moderate(post.getContent());
        if("REJECTED".equals(result)){
            throw new RuntimeException("Post contains inappropriate content");
        }

        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // GET ALL POSTS
    public List<Post> getAllPosts(){
        return postRepository.findAll();
    }

    // UPDATE POST
    public Post updatePost(Long id, String newContent, Long authenticatedUserId){

        String result = moderationService.moderate(newContent);
        if("REJECTED".equals(result)){
            throw new RuntimeException("Post contains inappropriate content");
        }

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        assertPostOwner(post, authenticatedUserId);

        post.setContent(newContent);
        return postRepository.save(post);
    }

    // DELETE POST
    public void deletePost(Long id, Long authenticatedUserId){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        assertPostOwner(post, authenticatedUserId);
        postRepository.deleteById(id);
    }

    // TOGGLE LIKE
    public Post toggleLike(Long postId, Long userId){

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(post.getLikedBy().contains(user)){
            post.getLikedBy().remove(user);
        } else {
            post.getLikedBy().add(user);
        }

        return postRepository.save(post);
    }

    private void assertPostOwner(Post post, Long authenticatedUserId) {
        // Why: Prevent users from editing/deleting another user's post.
        if (post.getUser() == null || !post.getUser().getId().equals(authenticatedUserId)) {
            throw new RuntimeException("You are not allowed to modify this post");
        }
    }

}