@echo off
title Run Frontend Tests (Vitest)

echo Running Vitest once...
cd /d "%~dp0frontend"

:: Run tests only once (no watch mode)
npx vitest run

if %ERRORLEVEL% NEQ 0 (
    echo Tests failed.
    exit /b 1
) else (
    echo All tests passed successfully!
    exit /b 0
)
