-- 1. 创建租户表（预留多租户/多公司架构）
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建系统全局配置表
CREATE TABLE IF NOT EXISTS system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 插入系统初始版本信息
INSERT INTO system_config (config_key, config_value, description)
VALUES ('kernel_version', '1.0.0', 'erp-core 微内核底层架构版本')
ON CONFLICT (config_key) DO NOTHING;

-- 4. 插入默认初始租户
INSERT INTO tenants (id, name)
VALUES ('default', '默认主企业')
ON CONFLICT (id) DO NOTHING;