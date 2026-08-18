#!/bin/bash
# Health check script for project stability
echo "--- Starting health check ---"

cd "$(dirname "$0")/.."

echo "Running type check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then echo "Type check failed!"; exit 1; fi

echo "Checking for circular dependencies..."
npx madge --circular src/
if [ $? -ne 0 ]; then echo "Circular dependencies found!"; exit 1; fi

echo "--- Project is healthy ---"
