const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'images');

async function optimizeImages() {
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const fileName = path.basename(file, ext);
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(imagesDir, `${fileName}.webp`);

            console.log(`Converting ${file} to WebP...`);

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Successfully compressed ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
}

optimizeImages();
