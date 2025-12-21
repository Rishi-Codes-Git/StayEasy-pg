@echo off
cd stayeasy-backend
echo Starting backend server...
start "StayEasy Backend" cmd /k node server.js
timeout /t 3
cd ..
cd stayeasy-frontend
echo Starting frontend app...
start "StayEasy Frontend" cmd /k npm start
