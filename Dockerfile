# 使用 Node.js 18 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制应用程序代码到工作目录
COPY . .

# 暴露端口
EXPOSE 3000

# 设置环境变量来控制是否执行种子数据填充
ENV RUN_SEEDERS=false

# 使用自定义的 Entrypoint 脚本作为容器入口点
ENTRYPOINT ["./entrypoint.sh"]

# 启动应用程序
CMD ["npm", "start"]
