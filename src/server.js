import { app } from './app.js';
import { env } from './config/env.js';
import { initializeSchema } from './db/schema.js';

initializeSchema(); 

app.listen(env.port, () => {
  console.log(`POS backend listening on http://localhost:${env.port}`);
});