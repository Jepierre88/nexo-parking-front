@echo off
title Proceso de Build - coins_server_park
color 0A
echo Limpiando y creando directorio de producción...
rmdir /s /q prod
mkdir prod

echo Compilando aplicación...
call npm run build

echo Copiando archivos necesarios a producción...
xcopy /E /I /Y .next\standalone\* prod\

echo Copiando carpeta .next completa...
xcopy /E /I /Y .next prod\.next\

echo Copiando archivos públicos...
xcopy /E /I /Y public prod\public\

echo Copiando package.json...
copy package.json prod\

echo Script completado con éxito!
pause