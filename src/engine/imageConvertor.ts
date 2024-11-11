import * as fs from 'fs';
import * as path from 'path';

export function getBase64FromImage(filePath: string): string | null {
  try {
    const imageBuffer = fs.readFileSync(filePath);

    const base64String = imageBuffer.toString('base64');

    const extname = path.extname(filePath).slice(1);
    const mimeType = `image/${extname}`;

    const dataURI = `data:${mimeType};base64,${base64String}`;

    return dataURI;
  } catch (error) {
    console.error('Error reading the file:', error);
    return null;
  }
}

// const imagePath = './src/images/noImageDefault.png';
// const base64Image = getBase64FromImage(imagePath);

// if (base64Image) {
//   console.log('Base64 Encoded Image String:', base64Image);
// }
