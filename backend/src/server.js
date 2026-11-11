import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./database/initialize.js";

try {
  await initializeDatabase();
  createApp().listen(env.PORT, () => {
    console.log(`NoteSystem API disponível em http://localhost:${env.PORT}`);
  });
} catch (error) {
  console.error("Falha ao inicializar a aplicação.", error);
  process.exitCode = 1;
}
