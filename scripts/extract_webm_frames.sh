#!/bin/bash

# Script to extract first frame from all WebM videos
# Requires FFmpeg to be installed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: FFmpeg is not installed. Please install FFmpeg first.${NC}"
    echo "You can install it using:"
    echo "  - macOS: brew install ffmpeg"
    echo "  - Ubuntu/Debian: sudo apt install ffmpeg"
    echo "  - Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Create output directory
OUTPUT_DIR="webm_frames"
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}Starting WebM frame extraction...${NC}"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Function to extract first frame from a WebM file
extract_frame() {
    local input_file="$1"
    local filename=$(basename "$input_file" .webm)
    local output_file="$OUTPUT_DIR/${filename}_frame.png"
    
    echo -e "Processing: ${YELLOW}$input_file${NC}"
    
    # Extract first frame as PNG
    if ffmpeg -i "$input_file" -vframes 1 -f image2 "$output_file" -y 2>/dev/null; then
        echo -e "  ✓ Created: ${GREEN}$output_file${NC}"
        return 0
    else
        echo -e "  ✗ Failed: ${RED}$input_file${NC}"
        return 1
    fi
}

# Counter for success/failure
success_count=0
total_count=0

# Process all WebM files in the webm directory
echo "Processing files in public/webm/..."
for file in public/webm/*.webm; do
    if [ -f "$file" ]; then
        total_count=$((total_count + 1))
        if extract_frame "$file"; then
            success_count=$((success_count + 1))
        fi
    fi
done

# Process all WebM files in the transparent directory
echo ""
echo "Processing files in public/transparent/..."
for file in public/transparent/*.webm; do
    if [ -f "$file" ]; then
        total_count=$((total_count + 1))
        if extract_frame "$file"; then
            success_count=$((success_count + 1))
        fi
    fi
done

# Summary
echo ""
echo "=========================================="
echo -e "${YELLOW}Extraction Summary:${NC}"
echo "Total files processed: $total_count"
echo -e "Successful extractions: ${GREEN}$success_count${NC}"
echo -e "Failed extractions: ${RED}$((total_count - success_count))${NC}"
echo "Output directory: $OUTPUT_DIR"

if [ $success_count -eq $total_count ] && [ $total_count -gt 0 ]; then
    echo -e "${GREEN}All frames extracted successfully!${NC}"
    exit 0
elif [ $success_count -gt 0 ]; then
    echo -e "${YELLOW}Some frames extracted successfully.${NC}"
    exit 1
else
    echo -e "${RED}No frames were extracted.${NC}"
    exit 1
fi
