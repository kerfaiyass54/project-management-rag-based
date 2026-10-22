package com.userskillsmanagement.usersandskillsmanagement.model.entity;

import com.userskillsmanagement.usersandskillsmanagement.model.enums.EngineerExperience;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EngineerExperience engineerExperience;

    @Column(nullable = false)
    private String engineerPosition;

    private Long teamId;
}