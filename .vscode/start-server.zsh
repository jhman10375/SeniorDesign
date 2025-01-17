#!/bin/zsh

# Start the server in the background
echo "Starting Server project..."
echo
cd server
python3.13 -m uvicorn main:app --host 127.0.0.1 --port 8000 &