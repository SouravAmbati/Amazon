import {
  getRabbitMQChannel,
} from "./rabbitmq.js";

export async function publishEvent({
  routingKey,
  message,
}) {
  const channel = await getRabbitMQChannel();

  channel.publish(
    "shopzone.events",
    routingKey,
    Buffer.from(
      JSON.stringify(message)
    ),
    {
      persistent: true,
      contentType: "application/json",
    }
  );
}