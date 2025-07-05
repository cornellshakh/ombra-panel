@echo off
start "backend-requirements" powershell -NoExit -Command "python -m pip install -r requirements.txt --user"
start "frontend-requirements" powershell -NoExit -Command "cd panel/frontend; pnpm install;"

