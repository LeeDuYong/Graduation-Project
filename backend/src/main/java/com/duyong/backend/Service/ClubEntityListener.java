package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClubEntityListener {
    private static IndexingManager indexingManager;

    @Autowired
    public void setIndexingManager(IndexingManager manager) {
        ClubEntityListener.indexingManager = manager;
    }

    @PostPersist
    public void onPostPersist(Club club) {
        System.out.println("새로운 동아리 감지. 인덱싱 시작: " + club.getName());
        indexingManager.addToIndex(club);
    }

    @PostUpdate
    public void onPostUpdate(Club club) {
        System.out.println("동아리 정보 변경 감지. 인덱싱 업데이트: " + club.getName());
        indexingManager.updateIndex(club);
    }

    @PostRemove
    public void onPostRemove(Club club) {
        System.out.println("동아리 삭제 감지. 인덱스에서 제거: " + club.getName());
        indexingManager.removeFromIndex(club);
    }
}
