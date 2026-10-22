-- Create indexes for better query performance

-- Index for searching skills by name
CREATE INDEX idx_skill_name ON skill(skill_name);

-- Index for finding skills for a given engineer
CREATE INDEX idx_engineer_skill_engineer_id ON engineer_skill(engineer_id);

-- Index for finding engineers with a given skill
CREATE INDEX idx_engineer_skill_skill_id ON engineer_skill(skill_id);