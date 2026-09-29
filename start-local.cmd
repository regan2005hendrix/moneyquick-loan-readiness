@echo off
setlocal
cd /d "%~dp0"
echo Stopping the previous MONEYQUICK service, if it is running...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":3001 .*LISTENING"') do taskkill /PID %%P /F >nul 2>&1
timeout /t 1 /nobreak >nul
echo Building the latest website files...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo Build failed. Read the message above, then press any key to close.
  pause >nul
  exit /b 1
)
echo.
echo MONEYQUICK is ready at http://localhost:3001
echo Keep this window open while using document checks.
node server.mjs
