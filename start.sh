#!/bin/bash

x-terminal-emulator -e "bash -c 'cd panel; python3 app.py'" &
x-terminal-emulator -e "bash -c 'cd panel/frontend; pnpm dev'" &
