package com.userskillsmanagement.usersandskillsmanagement.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Engineer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String engineerName;

    @Column(nullable = false)
    private String engineerSpeciality;

    @Column(nullable = false)
    private String engineerExperience;

    @Column(nullable = false)
    private String engineerPosition;

    private Long teamId;
}