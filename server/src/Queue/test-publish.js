import "dotenv/config";
import { publishEvent } from "./publish.js";



await publishEvent({
  routingKey: "image.uploaded",

  message: {
    eventType: "IMAGE_UPLOADED",

    productId: "test-product",

    imageId: "test-image",

    storageKey:
      "products/test-product/images/test-image/original",
  },
});

console.log("Message published");