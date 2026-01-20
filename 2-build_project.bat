@echo off
echo ==========================================
echo      CTA Generator - Build Project
echo ==========================================
echo.
echo Building for production...
cd /d "%~dp0"
call npm run build
echo.
if %ERRORLEVEL% EQU 0 (
    echo Build successful! Application is ready in 'dist' folder.
) else (
    echo Build failed. Please check the errors above.
)
pause
