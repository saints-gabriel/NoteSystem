/** Une várias consultas ({ data, loading, error, reload }) em uma só para `<AsyncContent>`. */
export function combineQueries(...queries) {
  const ready = queries.every((query) => query.data);
  return {
    data: ready ? queries.map((query) => query.data) : null,
    loading: queries.some((query) => query.loading),
    error: queries.find((query) => query.error)?.error ?? null,
    reload: () => queries.forEach((query) => query.reload()),
  };
}
