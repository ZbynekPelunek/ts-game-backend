import * as fs from 'fs';
import * as path from 'path';

// Function to get the base64 string from an image file
export function getBase64FromImage(filePath: string): string | null {
  try {
    // Read the file from the filesystem
    const imageBuffer = fs.readFileSync(filePath);

    // Convert the buffer to a base64 string
    const base64String = imageBuffer.toString('base64');

    // Optionally, you can specify the MIME type of the image (png, jpeg, etc.)
    const extname = path.extname(filePath).slice(1); // Get the file extension without the dot
    const mimeType = `image/${extname}`;

    // Create a data URI (optional, but useful if you're embedding the image in HTML or CSS)
    const dataURI = `data:${mimeType};base64,${base64String}`;

    return dataURI;
  } catch (error) {
    console.error('Error reading the file:', error);
    return null;
  }
}

// // Example usage
// const imagePath = './src/images/noImageDefault.png'; // Replace with your image path
// const base64Image = getBase64FromImage(imagePath);

// if (base64Image) {
//   console.log('Base64 Encoded Image String:', base64Image);
// }
