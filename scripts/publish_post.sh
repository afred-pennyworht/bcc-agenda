#!/usr/bin/env bash
set -euo pipefail

# Publish a single BCC2026 speaker announcement to Nostr
# Usage: publish_post.sh <post_number>

SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTS_FILE="$SCRIPTS_DIR/posts.json"
QUEUE_FILE="$SCRIPTS_DIR/queue.txt"
LOG_FILE="$SCRIPTS_DIR/publish.log"
SECRET_VAR="BCC_NOSTR_NSEC"
NSEC="${!SECRET_VAR}"

RELAYS=(
  "wss://relay.damus.io"
  "wss://relay.nostr.band"
  "wss://nos.lol"
  "wss://relay.primal.net"
  "wss://relay.snort.social"
)

if [ -z "$NSEC" ]; then
  echo "ERROR: NSEC not available" | tee -a "$LOG_FILE"
  exit 1
fi

# Get post number: from argument or next from queue
if [ -n "${1:-}" ]; then
  POST_NUM="$1"
else
  if [ ! -f "$QUEUE_FILE" ] || [ ! -s "$QUEUE_FILE" ]; then
    echo "$(date -Iseconds) Queue empty, nothing to publish" | tee -a "$LOG_FILE"
    exit 0
  fi
  POST_NUM=$(head -1 "$QUEUE_FILE")
fi

# Extract post data from JSON
POST_DATA=$(python3 -c "
import json, sys
with open('$POSTS_FILE') as f:
    posts = json.load(f)
for p in posts:
    if p['num'] == $POST_NUM:
        print(p['content'])
        print('---VIDEO_URL---')
        print(p['video_url'])
        print('---SLUG---')
        print(p['slug'])
        sys.exit(0)
print('NOT_FOUND')
sys.exit(1)
" 2>/dev/null)

if echo "$POST_DATA" | grep -q "NOT_FOUND"; then
  echo "ERROR: Post #$POST_NUM not found" | tee -a "$LOG_FILE"
  exit 1
fi

CONTENT=$(echo "$POST_DATA" | sed '/^---VIDEO_URL---$/,$d')
VIDEO_URL=$(echo "$POST_DATA" | sed -n '/^---VIDEO_URL---$/,/^---SLUG---$/p' | sed '1d;$d')
SLUG=$(echo "$POST_DATA" | sed -n '/^---SLUG---$/,$p' | sed '1d')

# Append video URL to content and write to temp file
FULL_CONTENT="${CONTENT}

${VIDEO_URL}"

TMPFILE=$(mktemp /tmp/nostr_post_XXXXXX.txt)
echo -n "$FULL_CONTENT" > "$TMPFILE"

echo "$(date -Iseconds) Publishing post #$POST_NUM ($SLUG)..." | tee -a "$LOG_FILE"

# Build relay args
RELAY_ARGS=""
for r in "${RELAYS[@]}"; do
  RELAY_ARGS="$RELAY_ARGS $r"
done

# Publish kind 1 event with nak
# -c @file reads content from file
RESULT=$(nak event \
  --sec "$NSEC" \
  -k 1 \
  -c "@$TMPFILE" \
  -t r="$VIDEO_URL" \
  -t imeta="url $VIDEO_URL;m $(case "$VIDEO_URL" in *.gif) echo image/gif;; *) echo video/mp4;; esac)" \
  $RELAY_ARGS 2>&1) || true

rm -f "$TMPFILE"

echo "$(date -Iseconds) Post #$POST_NUM result: $RESULT" | tee -a "$LOG_FILE"

# Remove from queue if it was queued
if [ -f "$QUEUE_FILE" ]; then
  grep -v "^${POST_NUM}$" "$QUEUE_FILE" > "$QUEUE_FILE.tmp" 2>/dev/null || true
  mv "$QUEUE_FILE.tmp" "$QUEUE_FILE"
fi

echo "$(date -Iseconds) Post #$POST_NUM ($SLUG) done." | tee -a "$LOG_FILE"
