@echo off
title Setup RabbitMQ - ViraLata Club

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando permissao de Administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo.
echo ================================================
echo   SETUP RABBITMQ - Executar apenas uma vez
echo ================================================
echo.

echo [1/3] Limpando dados corrompidos do RabbitMQ...
rmdir /s /q "C:\Users\%USERNAME%\AppData\Roaming\RabbitMQ\db\rabbit@%COMPUTERNAME%-mnesia" 2>nul
rmdir /s /q "C:\Users\%USERNAME%\AppData\Roaming\RabbitMQ\db\rabbit@%COMPUTERNAME%-feature_flags" 2>nul
echo       OK

echo.
echo [2/3] Configurando RabbitMQ para iniciar automaticamente com Windows...
sc config RabbitMQ start= auto >nul 2>&1
echo       OK

echo.
echo [3/3] Iniciando RabbitMQ...
net start RabbitMQ >nul 2>&1
timeout /t 10 /nobreak >nul
sc query RabbitMQ | find "RUNNING" >nul 2>&1
if %errorlevel%==0 (
    echo       OK - RabbitMQ rodando!
    echo.
    echo  Painel: http://localhost:15672  (guest / guest)
) else (
    echo       AVISO - Verifique o RabbitMQ manualmente.
)

echo.
echo ================================================
echo   Setup concluido. A partir de agora o
echo   RabbitMQ inicia automaticamente com o Windows.
echo ================================================
echo.
pause
