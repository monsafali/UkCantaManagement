
import fs from "fs";
export function getBase64ImageCanta() {
  const image = fs.readFileSync(new URL("../public/logo.png", import.meta.url));

  return `data:image/png;base64,${image.toString("base64")}`;
}




export const getFontBase64 = () => {
  const font = fs.readFileSync(new URL("../public/fonts/NotoNastaliqUrdu-Regular.ttf", import.meta.url));
  return `data:font/ttf;base64,${font.toString("base64")}`;
};



export const getEnglishFontBase64 = () => {
  const font = fs.readFileSync(new URL("../public/fonts/CantaEnglish.ttf", import.meta.url));

  return `data:font/ttf;base64,${font.toString("base64")}`;
};
