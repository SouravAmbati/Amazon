import amqp from "amqplib";
import 'dotenv/config';
const mq = await amqp.connect(process.env.RABBITMQ_URL);

export default mq;