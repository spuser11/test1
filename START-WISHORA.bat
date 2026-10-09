@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  echo Wishora is running at http://127.0.0.1:8080
  start "" "http://127.0.0.1:8080/index.html"
  py -m http.server 8080
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Wishora is running at http://127.0.0.1:8080
  start "" "http://127.0.0.1:8080/index.html"
  python -m http.server 8080
  goto :eof
)
echo Python was not found.
echo You can still double-click index.html to open Wishora directly.
pause
