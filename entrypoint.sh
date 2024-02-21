#!/bin/bash

# 等待数据库服务启动
echo "等待数据库服务启动..."
sleep 10

# 执行数据库迁移
echo "执行数据库迁移..."
npx sequelize-cli db:migrate

# 判断是否需要执行种子数据填充操作（根据环境变量等条件）
if [ "$RUN_SEEDERS" = "true" ]; then
    echo "执行种子数据填充..."
    npx sequelize-cli db:seed:all
else
    echo "不执行种子数据填充..."
fi

# 执行 Node.js 应用程序启动命令
echo "启动 Node.js 应用程序..."
exec "$@"
