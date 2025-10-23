package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Repository.ClubRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class IndexingManager {

    private final ClubRepository clubRepository;
    private final VectorStore vectorStore;

    public IndexingManager(ClubRepository clubRepository, VectorStore vectorStore) {
        this.clubRepository = clubRepository;
        this.vectorStore = vectorStore;
    }

    @PostConstruct
    public void indexAllClubsOnStartup() {
        System.out.println("동아리 데이터 인덱싱을 시작합니다...");
        List<Club> clubs = clubRepository.findAll();

        List<Document> documents = clubs.stream()
                .map(this::clubToDocument) // 헬퍼 메서드 사용
                .collect(Collectors.toList());

        if (!documents.isEmpty()) {
            vectorStore.add(documents);
        }
        System.out.println("총 " + documents.size() + "개의 동아리 데이터 인덱싱 완료.");
    }

    public void addToIndex(Club club) {
        vectorStore.add(List.of(clubToDocument(club)));
    }

    public void updateIndex(Club club) {
        removeFromIndex(club);
        addToIndex(club);
    }

    public void removeFromIndex(Club club) {
        //vectorStore.delete(SearchRequest.query("").withFilterExpression("clubId == " + club.getId()));
    }

    private Document clubToDocument(Club club) {
        String content = String.format("동아리 이름: %s\n카테고리: %s\n설명: %s\n모집 공고 제목: %s\n모집 공고 내용: %s",
                club.getName(),
                club.getCategory().toString(),
                club.getDescription(),
                club.getPost() != null ? club.getPost().getTitle() : "없음",
                club.getPost() != null ? club.getPost().getContent() : "없음"
        );

        String documentId = UUID.randomUUID().toString();

        Map<String, Object> metadata = Map.of("clubId", String.valueOf(club.getId()));

        return new Document(documentId, content, metadata);
    }
}
