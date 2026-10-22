-- Create the database
CREATE DATABASE userskill;

-- Connect to the database
\c userskill;

-- Create the skill table
CREATE TABLE skill (
    id BIGSERIAL PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL,
    skill_field VARCHAR(255)
);

-- Create the engineer table
CREATE TABLE engineer (
    id BIGSERIAL PRIMARY KEY,
    engineer_name VARCHAR(255) NOT NULL,
    engineer_speciality VARCHAR(255),
    engineer_experience VARCHAR(255),
    engineer_position VARCHAR(255),
    team_id BIGINT
);

-- Create the engineer_skill table
CREATE TABLE engineer_skill (
    id BIGSERIAL PRIMARY KEY,
    engineer_id BIGINT REFERENCES engineer(id),
    skill_id BIGINT REFERENCES skill(id),
    proficiency_level VARCHAR(255)
);