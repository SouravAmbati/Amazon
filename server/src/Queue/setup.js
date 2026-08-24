import "dotenv/config";

import {
  getRabbitMQChannel,
} from "./rabbitmq.js";

const channel = await getRabbitMQChannel();

await channel.assertExchange(
  "shopzone.events",
  "topic",
  {
    durable: true,
  }
);

await channel.assertQueue(
  "image.processing",
  {
    durable: true,
  }
);

await channel.bindQueue(
  "image.processing",
  "shopzone.events",
  "image.uploaded"
);

console.log("RabbitMQ topology created");

process.exit(0);