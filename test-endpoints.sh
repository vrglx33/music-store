#!/bin/bash

# Test script for Group 4 API endpoints
# This script manually tests all implemented endpoints

BASE_URL="http://localhost:3000"

echo "=== Testing Music Store API Endpoints ==="
echo ""

# Health check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

# Catalog endpoint
echo "2. Testing GET /api/catalog (all items, newest first, page 1)..."
curl -s "$BASE_URL/api/catalog?page=1&limit=5&sort=newest&type=all" | jq '.pagination'
echo ""

echo "3. Testing GET /api/catalog (albums only)..."
curl -s "$BASE_URL/api/catalog?type=albums&limit=3" | jq '.items[0] | {type, title, artist: .artist.name}'
echo ""

echo "4. Testing GET /api/catalog (songs only)..."
curl -s "$BASE_URL/api/catalog?type=songs&limit=3" | jq '.items[0] | {type, title, artist: .artist.name}'
echo ""

# Get first album ID for testing
ALBUM_ID=$(curl -s "$BASE_URL/api/catalog?type=albums&limit=1" | jq -r '.items[0].id')
echo "5. Testing GET /api/albums/:id with ID: $ALBUM_ID"
curl -s "$BASE_URL/api/albums/$ALBUM_ID" | jq '{title, genre, trackCount: (.tracks | length)}'
echo ""

# Get first song ID for testing
SONG_ID=$(curl -s "$BASE_URL/api/catalog?type=songs&limit=1" | jq -r '.items[0].id')
echo "6. Testing GET /api/songs/:id with ID: $SONG_ID"
curl -s "$BASE_URL/api/songs/$SONG_ID" | jq '{title, genre, duration, hasAlbum: (.album != null)}'
echo ""

# Cart endpoints
echo "7. Testing GET /api/cart (empty cart)..."
curl -s -c cookies.txt "$BASE_URL/api/cart" | jq '.'
echo ""

echo "8. Testing POST /api/cart/items (add album)..."
curl -s -b cookies.txt -c cookies.txt -X POST "$BASE_URL/api/cart/items" \
  -H "Content-Type: application/json" \
  -d "{\"itemType\": \"album\", \"itemId\": \"$ALBUM_ID\"}" | jq '.'
echo ""

echo "9. Testing POST /api/cart/items (add song)..."
curl -s -b cookies.txt -c cookies.txt -X POST "$BASE_URL/api/cart/items" \
  -H "Content-Type: application/json" \
  -d "{\"itemType\": \"song\", \"itemId\": \"$SONG_ID\"}" | jq '.'
echo ""

echo "10. Testing GET /api/cart (with items)..."
curl -s -b cookies.txt "$BASE_URL/api/cart" | jq '{totalItems, subtotal, itemTypes: [.items[].itemType]}'
echo ""

# Clean up
rm -f cookies.txt

echo "=== Testing Complete ==="
