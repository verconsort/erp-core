# ERP Core (微内核 ERP 核心架构)

一个行业通用、工业级的微内核 ERP 核心系统，采用“双轨制”基础设计（实体资产 vs. 无形资产），通过六大原子档案实现高内聚、低耦合的模块化企业资源管理。

## 🏛️ 核心架构

- **双轨基础**：实体资产与无形资产分离。
- **六大原子档案**：
  - `items` (物料档案)
  - `services` (服务档案)
  - `partners` (客商档案)
  - `fund_accounts` (资金账户)
  - `warehouses` (仓库档案)
  - `org_departments` (组织部门)

## 🛠️ 技术栈
- **运行环境**：WSL 2 (Ubuntu) / Node.js
- **数据库**：PostgreSQL / MySQL
- **版本控制**：Git / GitHub (SSH 鉴权)

## 📁 项目结构
- `src/core/` - 微内核核心加载器与错误处理
- `src/modules/` - 各原子档案业务模块
- `config/` - 数据库初始化及系统配置
