import app from "./src/app.js";
import { env } from "./src/config/env.js";
import redis from "./src/config/redis.js";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});