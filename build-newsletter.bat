@echo off
cd /d "%~dp0"
call npm run build
set "ERR=%ERRORLEVEL%"
if /i not "%~1"=="nopause" pause
exit /b %ERR%
