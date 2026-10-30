import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { createResource, listResource, updateResource } from "../services/resourceService.js";

/**
 * Cache em memória das coleções da API (students, classes, ...).
 * Cada tela pede o que precisa via `useResource(kind)`; a primeira chamada
 * busca na API e as seguintes reaproveitam o resultado.
 */
const ResourceContext = createContext(null);
const EMPTY = { status: "idle", items: [], error: null };

function reducer(state, action) {
  const entry = state[action.kind] ?? EMPTY;
  switch (action.type) {
    case "loading":
      return { ...state, [action.kind]: { ...entry, status: "loading", error: null } };
    case "loaded":
      return { ...state, [action.kind]: { status: "ready", items: action.items, error: null } };
    case "failed":
      return { ...state, [action.kind]: { ...entry, status: "error", error: action.error } };
    case "added":
      return { ...state, [action.kind]: { ...entry, items: [...entry.items, action.item] } };
    case "replaced":
      return {
        ...state,
        [action.kind]: {
          ...entry,
          items: entry.items.map((item) => (item.id === action.item.id ? action.item : item)),
        },
      };
    default:
      return state;
  }
}

export function ResourceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {});
  const requested = useRef(new Set());

  const load = useCallback(async (kind, { force = false } = {}) => {
    if (!force && requested.current.has(kind)) return;
    requested.current.add(kind);
    dispatch({ type: "loading", kind });
    try {
      dispatch({ type: "loaded", kind, items: await listResource(kind) });
    } catch (error) {
      requested.current.delete(kind);
      dispatch({ type: "failed", kind, error });
    }
  }, []);

  const create = useCallback(async (kind, data) => {
    const item = await createResource(kind, data);
    dispatch({ type: "added", kind, item });
    return item;
  }, []);

  const update = useCallback(async (kind, id, data) => {
    const item = await updateResource(kind, id, data);
    dispatch({ type: "replaced", kind, item });
    return item;
  }, []);

  const value = useMemo(() => ({ state, load, create, update }), [state, load, create, update]);
  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
}

export function useResource(kind) {
  const context = useContext(ResourceContext);
  if (!context) throw new Error("useResource deve ser usado dentro de <ResourceProvider>.");
  const { state, load, create, update } = context;

  useEffect(() => {
    load(kind);
  }, [kind, load]);

  const entry = state[kind] ?? EMPTY;
  const ready = entry.status === "ready";

  return {
    items: entry.items,
    data: ready ? entry.items : null,
    loading: !ready && entry.status !== "error",
    error: entry.error,
    reload: useCallback(() => load(kind, { force: true }), [load, kind]),
    create: useCallback((data) => create(kind, data), [create, kind]),
    update: useCallback((id, data) => update(kind, id, data), [update, kind]),
  };
}
