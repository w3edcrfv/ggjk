@echo off
chcp 65001 >nul
echo ========================================
echo   心理健康测评系统 - 本地服务器
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 服务器地址: http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

REM 检查 Node.js 是否安装
node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 检查 http-server 是否安装
where http-server >nul 2>&1
if errorlevel 1 (
    echo [提示] 首次运行，正在安装 http-server...
    echo.
    call npm install -g http-server
    echo.
)

REM 启动服务器（后台运行）
start "" http-server -p 8080 -c-1 --cors

REM 等待服务器启动
echo 正在等待服务器启动...
timeout /t 3 /nobreak >nul

REM 自动打开浏览器
echo 正在打开浏览器...
start http://localhost:8080

echo.
echo ========================================
echo   服务器已启动
echo ========================================
echo.
echo 如需停止服务器，请按 Ctrl+C
echo.

REM 保持窗口打开以便查看日志
cmd /k http-server -p 8080 -c-1 --cors
