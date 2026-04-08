#!/usr/bin/env bash
set -euo pipefail

# Cron wrapper: publishes the next post from the queue
# Called at 10:00, 12:15, 14:30 daily (135 min spacing, 3 posts/day)

SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
QUEUE_FILE="$SCRIPTS_DIR/queue.txt"
LOG_FILE="$SCRIPTS_DIR/publish.log"

# Read NSEC from RAM-only file (created by user session, not persisted to disk)
NSEC_FILE="/run/user/1000/bcc_nsec"
if [ ! -f "$NSEC_FILE" ]; then
  echo "$(date -Iseconds) ERROR: $NSEC_FILE not found (run: gpg -d /work/secrets/bcc_nostr_nsec.gpg > $NSEC_FILE)" >> "$LOG_FILE"
  exit 1
fi
export BCC_NOSTR_NSEC=$(cat "$NSEC_FILE")

if [ ! -f "$QUEUE_FILE" ] || [ ! -s "$QUEUE_FILE" ]; then
  echo "$(date -Iseconds) Queue empty. Cron can be removed." >> "$LOG_FILE"
  exit 0
fi

exec "$SCRIPTS_DIR/publish_post.sh"
