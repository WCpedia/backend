#!/bin/bash

MESSAGE=$(cat <<EOF
\`\`\`
 _____             _              _____ _             _   
|  __ \           | |            / ____| |           | |  
| |  | | ___ _ __ | | ___  _   _| (___ | |_ __ _ _ __| |_ 
| |  | |/ _ \ '_ \| |/ _ \| | | |\___ \| __/ _\` | '__| __|
| |__| |  __/ |_) | | (_) | |_| |____) | || (_| | |  | |_ 
|_____/ \___| .__/|_|\___/ \__, |_____/ \__\__,_|_|   \__|
            | |             __/ |                         
            |_|            |___/                          

                       배포 시작!
\`\`\`
EOF
)

JSON_PAYLOAD=$(jq -n \
                  --arg msg "$MESSAGE" \
                  '{content: $msg}')

curl -H "Content-Type: application/json" \
     -X POST \
     -d "$JSON_PAYLOAD" \
     ${DISCORD_SERVER_WEBHOOK}
