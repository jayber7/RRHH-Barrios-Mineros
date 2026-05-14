@echo off
title RRHH Barrios Mineros - Runner
setlocal

:: Obtener la ruta donde está este script para asegurar rutas relativas correctas
set "BASE_PATH=%~dp0"

echo ==========================================
echo    Iniciando Sistema RRHH Barrios Mineros
echo ==========================================

:: Abrir Backend - Usamos /k en lugar de /c para que la ventana no se cierre si falla
echo [SISTEMA] Iniciando Backend...
start "Backend - Node.js" cmd /k "cd /d %BASE_PATH%backend && npm run dev"

:: Abrir Frontend
echo [SISTEMA] Iniciando Frontend...
start "Frontend - React" cmd /k "cd /d %BASE_PATH%frontend && npm run dev"

echo.
echo ==========================================
echo [OK] Comandos enviados. 
