@echo off
echo ==========================================
echo      CTA Generator - Project Setup
echo ==========================================
echo.
echo Installing dependencies...
cd /d "%~dp0"
call npm install
echo.
if %ERRORLEVEL% EQU 0 (
    echo Setup complete! You can now run 'run_app.bat'
) else (
    echo Error during installation. Please check the logs.
)
pause
