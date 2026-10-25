# Teams & Projects Management implementation

Java 21 / Spring Boot / MongoDB / Redis / OpenFeign code scaffold for the management service.

## Assumptions to verify
- Team membership is exclusive: an engineer can belong to at most one team.
- `Project.teamId` references one team document by MongoDB ID.
- Project duration is `durationDays`; repository is represented by `repositoryUrl`.
- Users-Skills endpoint is configurable. Adapt `UsersSkillsClient` mappings to the real service API.
- This code uses the existing management module and does not include unrelated Keycloak/security configuration.

## Add dependencies if missing
The existing module should include Spring Web, Spring Data MongoDB, Spring Cache, Spring Data Redis, OpenFeign,
Bean Validation, and Jackson. If not already present, add the corresponding Spring Boot starters and
`spring-cloud-starter-openfeign` using the project's Spring Cloud BOM.

## Cache strategy
- Cache-aside: reads check Redis first; cache miss reads MongoDB/Users-Skills and stores the result.
- TTL: configurable (defaults: team detail 5 minutes, team lists 2 minutes, project detail 5 minutes, project lists 2 minutes).
- Invalidation: team writes evict team detail/list/available-engineers caches; project writes evict project detail/list/stats caches.
- Available-engineer results are short-lived and evicted after any team membership change.
- Redis cache keys are namespaced and values use JSON serialization.
- Do not cache failures from Users-Skills.

## Important
Cross-service calls and MongoDB writes cannot be made one atomic transaction. The service validates membership
before writing, but simultaneous manager requests can race. For strict exclusivity, add a dedicated assignment
registry/unique index or move assignment ownership to a single authoritative service.
