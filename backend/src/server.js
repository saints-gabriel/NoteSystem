import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { initializeDatabase } from "./models/index.js";

initializeDatabase().then(() => createApp().listen(env.PORT, () => console.log(`NoteSystem API disponível em http://localhost:${env.PORT}`))).catch((error) => {
  console.error("Falha ao inicializar o banco de dados.", error);
  process.exitCode = 1;
});
