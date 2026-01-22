@echo off
echo ==========================================
echo      CTA Generator - Build EXE
echo ==========================================
echo.
echo Building Windows Executable...
cd /d "%~dp0"
call npm run electron:build
echo.
if %ERRORLEVEL% EQU 0 (
    echo Build successful! Installer is in 'dist-electron/release' folder.
) else (
    echo Build failed. Please check the errors above.
)
pause
