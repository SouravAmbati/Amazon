export async function bodyToBuffer(body) {
  if (!body) {
    throw new Error("B2 object has no body");
  }

  return body.transformToByteArray()
    .then((bytes) => Buffer.from(bytes));
}