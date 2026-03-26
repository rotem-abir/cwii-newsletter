@echo off
cd /d "%~dp0"
call "%~dp0scripts\publish-newsletter.bat"
exit /b %ERRORLEVEL%
