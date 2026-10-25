package com.teamsprojects.management.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document("teams")
public class Team {
    @Id
    private String id;

    @NotBlank
    private String name;

    @NotEmpty
    private List<String> memberIds = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public Team() {}

    public Team(String name, List<String> memberIds) {
        this.name = name;
        this.memberIds = memberIds == null ? new ArrayList<>() : new ArrayList<>(memberIds);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getMemberIds() { return memberIds; }
    public void setMemberIds(List<String> memberIds) {
        this.memberIds = memberIds == null ? new ArrayList<>() : new ArrayList<>(memberIds);
    }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
