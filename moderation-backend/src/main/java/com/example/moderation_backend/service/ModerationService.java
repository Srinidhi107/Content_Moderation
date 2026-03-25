package com.example.moderation_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ModerationService {

    private final List<String> bannedWords =
            List.of("hate", "idiot", "stupid");

    public String moderate(String text) {

        if (text == null || text.isEmpty()) {
            return "REJECTED";
        }

        for (String word : bannedWords) {
            if (text.toLowerCase().contains(word)) {
                return "REJECTED";
            }
        }

        return "APPROVED";
    }
}