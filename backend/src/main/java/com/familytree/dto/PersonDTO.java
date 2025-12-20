package com.familytree.dto;

import com.familytree.entity.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonDTO {
    private Long id;
    private String fullName;
    private Gender gender;
    private LocalDate dateOfBirth;
    private LocalDate dateOfDeath;
    private Boolean isAlive;
    private String imageUrl;
    private String contactNumber;
    private String email;
    private Long fatherId;
    private Long motherId;
}
