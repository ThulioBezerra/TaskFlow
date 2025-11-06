@echo off
title Rodando Vite e encerrando somente o processo correto

echo Iniciando servidor Vite...
:: Inicia npm run dev e guarda o PID
start "" /B cmd /C "npm run dev > vite.log 2>&1"
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| find "PID:"') do (
    set PID=%%a
)

:wait
timeout /t 1 >nul
findstr /C:"ready in" vite.log >nul
if %errorlevel%==0 (
    echo ✅ VITE iniciado com sucesso! Encerrando somente o processo PID %PID%...
    taskkill /PID %PID% /F >nul 2>&1
    del vite.log
    exit /b 0
)
goto wait
