@echo off
title ViraLata Club

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando permissao de Administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title ViraLata Club [Admin]
echo.
echo ================================================
echo   VIRALATA CLUB - Iniciando servicos
echo ================================================
echo.

echo [1/3] PostgreSQL...
sc query postgresql-x64-16 | find "RUNNING" >nul 2>&1
if %errorlevel%==0 (
    echo       OK - ja rodando.
) else (
    net start postgresql-x64-16 >nul 2>&1
    timeout /t 4 /nobreak >nul
    sc query postgresql-x64-16 | find "RUNNING" >nul 2>&1
    if %errorlevel%==0 (
        echo       OK - Iniciado!
    ) else (
        echo       ERRO - PostgreSQL nao iniciou.
        pause & exit /b 1
    )
)

echo.
echo [2/3] RabbitMQ...
sc query RabbitMQ | find "RUNNING" >nul 2>&1
if %errorlevel%==0 (
    echo       OK - ja rodando.
) else (
    net start RabbitMQ >nul 2>&1
    timeout /t 10 /nobreak >nul
    sc query RabbitMQ | find "RUNNING" >nul 2>&1
    if %errorlevel%==0 (
        echo       OK - Iniciado!
    ) else (
        echo       AVISO - RabbitMQ nao iniciou.
        echo       Execute setup-rabbitmq.bat como admin primeiro.
    )
)

echo.
echo [3/3] Iniciando servidor...
echo.
echo ================================================
echo   Site:   http://localhost:3000
echo   Admin:  http://localhost:3000/pages/admin/
echo   Rabbit: http://localhost:15672  (guest/guest)
echo ================================================
echo.

cd /d "%~dp0"
npm run dev
pause
