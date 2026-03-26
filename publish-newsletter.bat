@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

call build-newsletter.bat nopause
if errorlevel 1 (
  echo [publish] BUILD FAILED
  goto :endfail
)

if not exist "dist\" (
  echo [publish] dist folder missing
  goto :endfail
)

REM Pick newest dist\index-YYYY-MM.html by last write time (do not use %%DATE%%)
set "BUILD_FILE="
for /f "delims=" %%F in ('dir /b /o-d "dist\index-*.html" 2^>nul') do (
  set "BUILD_FILE=%%F"
  goto :havefile
)
echo [publish] No dist\index-*.html found
goto :endfail

:havefile
set "LOCAL_FILE=%~dp0dist\!BUILD_FILE!"
set "REMOTE_NAME=!BUILD_FILE!"

REM Load .env (KEY=VALUE; # comments; value may contain =)
if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do (
    if not "%%a"=="" set "%%a=%%b"
  )
)

if not defined R2_BUCKET_NAME (
  echo [publish] R2_BUCKET_NAME is not set ^(add to .env^)
  goto :endfail
)
if not defined R2_PUBLIC_BASE_URL (
  echo [publish] R2_PUBLIC_BASE_URL is not set ^(add to .env^)
  goto :endfail
)

set "BASE=!R2_PUBLIC_BASE_URL!"
if "!BASE:~-1!"=="\" set "BASE=!BASE:~0,-1!"
if "!BASE:~-1!"=="/" set "BASE=!BASE:~0,-1!"

set "OBJECT_PATH=!R2_BUCKET_NAME!/newsletter/!REMOTE_NAME!"
set "FINAL_URL=!BASE!/newsletter/!REMOTE_NAME!"

echo [publish] Local file: !LOCAL_FILE!
echo [publish] Upload path: !OBJECT_PATH!
echo [publish] Final URL:   !FINAL_URL!

call npx wrangler r2 object put "!OBJECT_PATH!" --file "!LOCAL_FILE!" --content-type "text/html; charset=utf-8" --remote
if errorlevel 1 (
  echo [publish] UPLOAD FAILED
  goto :endfail
)

set "FINAL_URL_VERIFY=!FINAL_URL!"
powershell -NoProfile -NonInteractive -Command "try { $r = Invoke-WebRequest -Uri $env:FINAL_URL_VERIFY -UseBasicParsing -TimeoutSec 60; if ($r.StatusCode -ne 200) { Write-Host ('[publish] VERIFY FAILED: HTTP ' + $r.StatusCode); exit 1 } } catch { Write-Host '[publish] VERIFY FAILED:' $_.Exception.Message; exit 1 }"
if errorlevel 1 goto :endfail

echo [publish] VERIFY OK: HTTP 200
echo [publish] SUCCESS

:endok
pause
exit /b 0

:endfail
pause
exit /b 1
