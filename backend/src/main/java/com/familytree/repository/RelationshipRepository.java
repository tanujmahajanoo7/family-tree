package com.familytree.repository;

import com.familytree.entity.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findByPerson1IdOrPerson2Id(Long person1Id, Long person2Id);
}
