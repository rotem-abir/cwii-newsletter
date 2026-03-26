@echo off
cd /d "%~dp0"
node scripts\build-newsletter.mjs
pause
