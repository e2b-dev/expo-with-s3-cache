#!/bin/bash
set -euo pipefail

BUCKET="${AWS_BUCKET}"
ENDPOINT_URL="${AWS_ENDPOINT_URL}"
FILENAME="${CACHE_FILENAME:-metro-cache.tar.gz}"
CACHE_DIR="${CACHE_DIR:-/tmp/metro-cache}"
LOG_DIR="${CACHE_LOG_DIR:-/tmp/e2b-metro-cache-logs}"
LOG_FILE="${CACHE_LOG_FILE:-$LOG_DIR/cache-download-$(date -u +%Y%m%dT%H%M%SZ).log}"

mkdir -p "$LOG_DIR"

log() {
  echo "$1" | tee -a "$LOG_FILE"
}

log "[CacheSync] Downloading cache from S3... (log: $LOG_FILE)"

mkdir -p "$CACHE_DIR"

if aws s3 cp "s3://$BUCKET/$FILENAME" - --endpoint-url "$ENDPOINT_URL" 2>>"$LOG_FILE" \
  | tar xzf - -C "$CACHE_DIR" 2>>"$LOG_FILE"; then
  log "[CacheSync] Cache downloaded and extracted to $CACHE_DIR"
else
  log "[CacheSync] No existing cache found or download failed, starting fresh"
fi
