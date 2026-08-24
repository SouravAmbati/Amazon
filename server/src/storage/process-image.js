import sharp from "sharp";

export async function inspectImage(buffer) {
  const image = sharp(buffer);

  return image.metadata();
}

export async function generateVariants(buffer) {
  const thumbnail = await sharp(buffer)
    .resize({
      width: 200,
      height: 200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
    })
    .toBuffer();

  const medium = await sharp(buffer)
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
    })
    .toBuffer();

  const large = await sharp(buffer)
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 85,
    })
    .toBuffer();

  return {
    thumbnail,
    medium,
    large,
  };
}