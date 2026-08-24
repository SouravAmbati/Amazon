import { fileTypeFromBuffer } from "file-type";

export async function detectFileType(buffer) {
  const result = await fileTypeFromBuffer(buffer);

  if (!result) {
    throw new Error(
      "Unable to determine file type"
    );
  }

  return result;
}