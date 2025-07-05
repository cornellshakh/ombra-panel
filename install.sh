#!/bin/bash

# Function to find and use an available terminal
run_in_terminal() {
    command="$1"
    
    # Try different terminals available on Arch Linux
    if command -v konsole &> /dev/null; then
        konsole -e "bash -c '$command'" &
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "$command" &
    elif command -v xterm &> /dev/null; then
        xterm -e "bash -c '$command'" &
    elif command -v alacritty &> /dev/null; then
        alacritty -e bash -c "$command" &
    elif command -v kitty &> /dev/null; then
        kitty bash -c "$command" &
    else
        echo "No supported terminal emulator found. Running commands directly..."
        bash -c "$command"
    fi
}

# Run the installation commands
run_in_terminal "python3 -m pip install -r requirements.txt"
run_in_terminal "cd panel/frontend && pnpm install"
