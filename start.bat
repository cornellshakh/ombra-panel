@echo off
start "backend" powershell -NoExit -Command "cd panel; python app.py"
start "frontend" powershell -NoExit -Command "cd panel/frontend; pnpm dev"
