package com.duyong.backend.Controller;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public RecommendationController(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
    }

    @PostMapping
    public ResponseEntity<String> getRecommendation(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body("질문을 입력해주세요.");
        }

        // 1. Retrieval
        SearchRequest searchRequest = SearchRequest.defaults().withQuery(query).withTopK(3);
        List<Document> similarDocuments = vectorStore.similaritySearch(searchRequest);
        String context = similarDocuments.stream()
                .map(Document::getFormattedContent)
                .collect(Collectors.joining("\n---\n"));

        // 2. Augmentation
        String systemMessage = "당신은 성균관대학교 동아리 추천 전문가입니다. " +
                "주어진 [컨텍스트] 정보를 바탕으로 사용자의 [질문]에 가장 적합한 동아리를 추천하고, " +
                "그 이유를 친절하게 설명해주세요. 컨텍스트에 없는 내용은 언급하지 마세요. 답변은 한국어 Markdown 형식으로 예쁘게 꾸며주세요.";

        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemMessage);

        String userMessage = "--- [컨텍스트] ---\n{context}\n\n--- [질문] ---\n{query}";
        PromptTemplate userPromptTemplate = new PromptTemplate(userMessage);

        // 3. Generation
        String response = chatClient.prompt()
                .system(systemMessage)
                .user(p -> p.text(userMessage)
                        .param("context", context)
                        .param("query", query))
                .call()
                .content();

        return ResponseEntity.ok(response);
    }
}