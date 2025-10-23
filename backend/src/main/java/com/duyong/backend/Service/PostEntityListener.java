package com.duyong.backend.Service;

import com.duyong.backend.Entity.Post;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PostEntityListener {
    private static IndexingManager indexingManager;

    @Autowired
    public void setIndexingManager(IndexingManager manager) {
        PostEntityListener.indexingManager = manager;
    }

    @PostPersist
    @PostUpdate
    public void onPostPersistOrUpdate(Post post) {
        if (post.getClub() != null) {
            System.out.println("게시물 변경 감지. 연관 동아리 인덱싱 업데이트: " + post.getClub().getName());
            indexingManager.updateIndex(post.getClub());
        }
    }

    @PostRemove
    public void onPostRemove(Post post) {
        if (post.getClub() != null) {
            System.out.println("게시물 삭제 감지. 연관 동아리 인덱싱 업데이트: " + post.getClub().getName());
            indexingManager.updateIndex(post.getClub());
        }
    }
}