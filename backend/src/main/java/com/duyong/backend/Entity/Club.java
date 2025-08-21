package com.duyong.backend.Entity;

import com.duyong.backend.Enums;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name; // 동아리 이름
    private String description; // 예): 축구 동아리, 여행 동아리 등. 추상적인 이름으로 어떤 동아리인지 알기 어려운 상황 방지

    @Enumerated(EnumType.STRING)
    private Enums.Category category; //학술 or 취미

    private boolean recruiting; // 모집시 게시물을 올리는 것이 아니라, 동아리별로 페이지를 관리하는 형식이기에, 모집 여부 관리
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
