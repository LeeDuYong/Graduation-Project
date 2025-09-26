package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Entity.Post;
import com.duyong.backend.Enums.Category;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class ClubSpecification {

    public static Specification<Club> hasCategory(Category category) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<Club> isRecruiting(boolean recruiting) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("recruiting"), recruiting);
    }

    public static Specification<Club> hasKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            Join<Club, Post> postJoin = root.join("post");

            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("name"), "%" + keyword + "%"),
                    criteriaBuilder.like(root.get("description"), "%" + keyword + "%"),
                    criteriaBuilder.like(postJoin.get("title"), "%" + keyword + "%"),
                    criteriaBuilder.like(postJoin.get("content"), "%" + keyword + "%")
            );
        };
    }
}