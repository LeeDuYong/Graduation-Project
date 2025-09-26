package com.duyong.backend.Entity;

import com.duyong.backend.Enums;
import com.duyong.backend.Service.ClubEntityListener;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@EntityListeners(ClubEntityListener.class)
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

    @OneToOne(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private Post post;
    // 연관 관계 편의 메서드: Club에서 Post를 쉽게 설정
    public void setPost(Post post) {
        this.post = post;
        post.setClub(this);
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Favorite> favoritedBy = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
