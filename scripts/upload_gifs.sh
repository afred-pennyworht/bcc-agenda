#!/usr/bin/env bash
set -euo pipefail

UPLOAD_URL="https://nostr.build/api/v2/nip96/upload"
GIF_DIR="/work/bcc2026/assets/speakers/gif"
OUTPUT_FILE="/work/bcc2026/assets/speakers/gif_upload_urls.txt"
NSEC="$BCC_NOSTR_NSEC"

if [ -z "$NSEC" ]; then
  echo "ERROR: secret not available"
  exit 1
fi

: > "$OUTPUT_FILE"

for file in "$GIF_DIR"/*.gif; do
  filename=$(basename "$file")
  echo "Uploading: $filename"

  AUTH_EVENT=$(nak event \
    --sec "$NSEC" \
    -k 27235 \
    -t u="$UPLOAD_URL" \
    -t method="POST" \
    -c "" 2>/dev/null)

  AUTH_BASE64=$(echo "$AUTH_EVENT" | base64 -w 0)

  RESPONSE=$(curl -s -X POST "$UPLOAD_URL" \
    -H "Authorization: Nostr $AUTH_BASE64" \
    -F "file=@$file" \
    -F "content_type=image/gif" \
    -F "no_transform=true")

  URL=$(echo "$RESPONSE" | python3 -c "
import sys, json
r = json.load(sys.stdin)
tags = r.get('nip94_event', {}).get('tags', [])
for t in tags:
    if t[0] == 'url':
        print(t[1])
        break
" 2>/dev/null || echo "")

  if [ -n "$URL" ]; then
    echo "  -> $URL"
    echo "$filename $URL" >> "$OUTPUT_FILE"
  else
    echo "  -> ERROR: $RESPONSE"
    echo "$filename ERROR" >> "$OUTPUT_FILE"
  fi

  sleep 2
done

echo "=== DONE ==="
echo "Total: $(wc -l < "$OUTPUT_FILE") files"
