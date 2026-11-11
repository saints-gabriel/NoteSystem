const DEFAULT_API_URL = "http://localhost:3001";

// O Bun substitui `process.env.BUN_PUBLIC_*` em tempo de build (veja bunfig.toml).
// No navegador, sem a variável definida, `process` não existe e usamos o padrão.
function readApiUrl() {
  try {
    return process.env.BUN_PUBLIC_API_URL;
  } catch {
    return undefined;
  }
}

export const API_URL = readApiUrl() || DEFAULT_API_URL;
