#!/bin/bash
cd /home/kavia/workspace/code-generation/quizverse-99203-99211/quizverse
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

