const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

if (!ffmpegPath) {
    console.error('ffmpeg-static binary not found!');
    process.exit(1);
}

// Tell fluent-ffmpeg where to find the binary
ffmpeg.setFfmpegPath(ffmpegPath);

const assetsDir = path.join(__dirname, '../src/assets');
const originalsDir = path.join(assetsDir, 'originals');

// Ensure originals directory exists
if (!fs.existsSync(originalsDir)) {
    fs.mkdirSync(originalsDir, { recursive: true });
}

// Find all MP4 files in assets
const files = fs.readdirSync(assetsDir).filter(f => f.toLowerCase().endsWith('.mp4'));

console.log(`Found ${files.length} video files to process...`);

async function processFile(file) {
    const filePath = path.join(assetsDir, file);
    const originalPath = path.join(originalsDir, file);
    
    // Check if we already processed it (simple check: if original exists)
    // Actually, to be safe and robust, let's just re-process everything that isn't already backed up? 
    // Or just process everything in assets that is an MP4.

    // 1. Move original to backup if not already there
    if (!fs.existsSync(originalPath)) {
        console.log(`Backing up ${file}...`);
        fs.copyFileSync(filePath, originalPath);
    }

    console.log(`Converting ${file}...`);
    
    return new Promise((resolve, reject) => {
        ffmpeg(originalPath)
            .outputOptions([
                '-c:v libx264',      // H.264 video codec
                '-crf 23',           // Constant Rate Factor (quality/size balance)
                '-preset medium',    // Encoding speed preset
                '-c:a aac',          // AAC audio codec
                '-b:a 128k',         // Audio bitrate
                '-movflags +faststart', // Move metadata to beginning for faster web playback
                '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2', // Ensure dimensions are even (required for some H.264 players)
                '-pix_fmt yuv420p'   // Pixel format for max compatibility
            ])
            .save(filePath) // Overwrite the file in assets with the optimized version
            .on('end', () => {
                console.log(`Successfully converted ${file}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error converting ${file}:`, err);
                reject(err);
            });
    });
}

async function run() {
    for (const file of files) {
        try {
            await processFile(file);
        } catch (e) {
            console.error(`Failed to process ${file}, skipping.`);
        }
    }
    console.log("All done!");
}

run();
