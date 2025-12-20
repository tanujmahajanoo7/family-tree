package com.familytree.dto;

import com.familytree.entity.RelationshipType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RelationshipDTO {
    private Long person1Id;
    private Long person2Id;
    private RelationshipType relationshipType;
    private LocalDate startDate;
    private LocalDate endDate;
}
