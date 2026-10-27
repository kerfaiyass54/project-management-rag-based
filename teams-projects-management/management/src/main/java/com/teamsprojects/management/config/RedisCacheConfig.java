package com.teamsprojects.management.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class RedisCacheConfig {

    @Bean
    ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .findAndAddModules()
                .build();
    }

    @Bean
    RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        ObjectMapper cacheMapper = objectMapper.copy()
                .activateDefaultTyping(
                        BasicPolymorphicTypeValidator.builder()
                                .allowIfSubType("com.teamsprojects.management")
                                .allowIfSubType("java.util")
                                .allowIfSubType("java.time")
                                .build(),
                        ObjectMapper.DefaultTyping.NON_FINAL);

        var serializer = new GenericJackson2JsonRedisSerializer(cacheMapper);
        var valueSerialization = RedisSerializationContext.SerializationPair.fromSerializer(serializer);

        RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .disableCachingNullValues()
                .serializeValuesWith(valueSerialization);

        Map<String, RedisCacheConfiguration> configs = new HashMap<>();
        configs.put(CacheNames.TEAM_DETAIL, base.entryTtl(Duration.ofMinutes(5)));
        configs.put(CacheNames.TEAM_LIST, base.entryTtl(Duration.ofMinutes(2)));
        configs.put(CacheNames.AVAILABLE_ENGINEERS, base.entryTtl(Duration.ofMinutes(1)));
        configs.put(CacheNames.PROJECT_DETAIL, base.entryTtl(Duration.ofMinutes(5)));
        configs.put(CacheNames.PROJECT_LIST, base.entryTtl(Duration.ofMinutes(2)));
        configs.put(CacheNames.PROJECT_STATS, base.entryTtl(Duration.ofMinutes(2)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(base)
                .withInitialCacheConfigurations(configs)
                .build();
    }
}
