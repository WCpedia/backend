#!/bin/bash

MESSAGE=$(cat <<EOF
\`\`\`
  _____                           ____  _   _
 / ____|                         / __ \| \ | |
| (___   ___ _ ____   _____ _ __| |  | |  \| |
 \___ \ / _ \ '__\ \ / / _ \ '__| |  | | . \`|
 ____) |  __/ |   \ V /  __/ |  | |__| | |\  |
|_____/ \___|_|    \_/ \___|_|   \____/|_| \_|

                  서버 온!
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
