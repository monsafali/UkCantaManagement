
import fs from "fs";
import path from "path";

export function getBase64ImageCanta() {
  const imagePath = path.join(process.cwd(), "public/logo.png");

  const image = fs.readFileSync(imagePath);

  return `data:image/png;base64,${image.toString("base64")}`;
}




export const getFontBase64 = () => {
  const fontPath = path.join(process.cwd(), "public/fonts/NotoNastaliqUrdu-Regular.ttf");
  const font = fs.readFileSync(fontPath);
  return `data:font/ttf;base64,${font.toString("base64")}`;
};



export const getEnglishFontBase64 = () => {
  const fontPath = path.join(
    process.cwd(),
    "public/fonts/CantaEnglish.ttf"
  );

  const font = fs.readFileSync(fontPath);

  return `data:font/ttf;base64,${font.toString("base64")}`;
};
