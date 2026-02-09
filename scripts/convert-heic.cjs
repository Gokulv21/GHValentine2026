const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const jpeg = require('jpeg-js');

const assetsDir = path.join(__dirname, '../src/assets');

async function convertHeicToJpg() {
  try {
    const files = fs.readdirSync(assetsDir);
    const heicFiles = files.filter(file => file.toLowerCase().endsWith('.heic'));

    console.log(`Found ${heicFiles.length} HEIC files to convert.`);

    for (const file of heicFiles) {
        const inputPath = path.join(assetsDir, file);
        const outputPath = path.join(assetsDir, file.replace(/\.heic$/i, '.jpg')); // Output as JPG

        if (fs.existsSync(outputPath)) {
            console.log(`Skipping ${file}, JPG already exists.`);
            continue;
        }

        console.log(`Converting ${file}...`);
        const inputBuffer = fs.readFileSync(inputPath);
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 0.8
        });

        fs.writeFileSync(outputPath, outputBuffer);
        console.log(`Saved ${outputPath}`);
    }
    console.log("All HEIC files converted successfully.");

  } catch (error) {
    console.error("Error converting HEIC files:", error);
  }
}

convertHeicToJpg();
