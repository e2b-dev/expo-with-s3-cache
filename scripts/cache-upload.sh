#!/bin/bash
set -euo pipefail

BUCKET="${AWS_BUCKET}"
ENDPOINT_URL="${AWS_ENDPOINT_URL}"
FILENAME="${CACHE_FILENAME:-metro-cache.tar.gz}"
CACHE_DIR="${CACHE_DIR:-/tmp/metro-cache}"
LOG_DIR="${CACHE_LOG_DIR:-/tmp/e2b-metro-cache-logs}"
LOG_FILE="${CACHE_LOG_FILE:-$LOG_DIR/cache-upload-$(date -u +%Y%m%dT%H%M%SZ).log}"

mkdir -p "$LOG_DIR"

log() {
  echo "$1" | tee -a "$LOG_FILE"
}

if [ ! -d "$CACHE_DIR" ]; then
  log "[CacheSync] No cache directory found at $CACHE_DIR, skipping upload (log: $LOG_FILE)"
  exit 0
fi

log "[CacheSync] Uploading cache to S3... (log: $LOG_FILE)"

tar czf - -C "$CACHE_DIR" . 2>>"$LOG_FILE" \
  | aws s3 cp - "s3://$BUCKET/$FILENAME" --endpoint-url "$ENDPOINT_URL" >>"$LOG_FILE" 2>&1

log "[CacheSync] Cache uploaded to s3://$BUCKET/$FILENAME"
