#!/bin/bash

echo "========================================"
echo "  心理健康测评系统 - 本地服务器"
echo "========================================"
echo ""
echo "正在启动本地服务器..."
echo ""
echo "服务器地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "========================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js: https://nodejs.org/"
    echo ""
    exit 1
fi

# 检查 http-server 是否安装
if ! command -v http-server &> /dev/null; then
    echo "[提示] 首次运行，正在安装 http-server..."
    echo ""
    npm install -g http-server
    echo ""
fi

# 启动服务器（后台运行）
http-server -p 8080 -c-1 --cors &
SERVER_PID=$!

# 等待服务器启动
echo "正在等待服务器启动..."
sleep 3

# 自动打开浏览器（根据不同操作系统）
echo "正在打开浏览器..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:8080
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:8080 2>/dev/null || sensible-browser http://localhost:8080 2>/dev/null || firefox http://localhost:8080
else
    # 尝试通用命令
    which xdg-open > /dev/null 2>&1 && xdg-open http://localhost:8080
fi

echo ""
echo "========================================"
echo "  服务器已启动"
echo "========================================"
echo ""
echo "如需停止服务器，请按 Ctrl+C"
echo ""

# 等待服务器进程
wait $SERVER_PID
