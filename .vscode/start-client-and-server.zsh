#!/bin/zsh

# Start the server in the background
echo "Starting Server project..."
echo
cd server
python3.13 -m uvicorn main:app --host 127.0.0.1 --port 8000 > /dev/null 2>&1 &
echo "Client started"

# Wait for the server to start (adjust timeout as needed)
sleep 5 

# Start the Angular project
echo "Starting Client..."
echo
cd ../client/college-sports-plus
ng serve --host 0.0.0.0