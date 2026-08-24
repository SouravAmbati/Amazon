import amqp from "amqplib";

let connection;
let channel;

export async function getRabbitMQChannel() {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(
    process.env.RABBITMQ_URL
  );

  channel = await connection.createChannel();

  console.log("Connected to RabbitMQ");

  return channel;
}