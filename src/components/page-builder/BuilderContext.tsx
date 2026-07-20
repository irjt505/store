"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateId } from "@/lib/utils";
import type { DeviceType, PageBuilderState, PageElement } from "./types";
import { BLOCK_DEFINITIONS } from "./blocks";

interface BuilderContextValue extends PageBuilderState {
  addElement: (type: string, position?: { x: number; y: number }) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<PageElement>) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, direction: "forward" | "backward") => void;
  selectElement: (id: string | null) => void;
  clearSelection: () => void;
  setDevice: (device: DeviceType) => void;
  setZoom: (zoom: number) => void;
  setPageName: (name: string) => void;
  setPageSlug: (slug: string) => void;
  saveDraft: () => void;
  publish: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedElement: PageElement | null;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

const MAX_HISTORY = 50;
const AUTOSAVE_INTERVAL = 30000;

function getStorageKey(pageId: string) {
  return `page-builder-${pageId}`;
}

function loadFromStorage(pageId: string): {
  elements: PageElement[];
  pageName: string;
  pageSlug: string;
  pageStatus: "draft" | "published";
} | null {
  try {
    const raw = localStorage.getItem(getStorageKey(pageId));
    if (raw) {
      const data = JSON.parse(raw);
      return {
        elements: data.elements || [],
        pageName: data.pageName || "صفحة جديدة",
        pageSlug: data.pageSlug || "new-page",
        pageStatus: data.pageStatus || "draft",
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function pushHistory(elements: PageElement[], state: {
  history: PageElement[][];
  historyIndex: number;
}): { history: PageElement[][]; historyIndex: number } {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(elements.map((e) => JSON.parse(JSON.stringify(e))));
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

function getInitialState(pageId: string) {
  const stored = loadFromStorage(pageId);
  if (stored) {
    return {
      elements: stored.elements,
      pageName: stored.pageName,
      pageSlug: stored.pageSlug,
      pageStatus: stored.pageStatus as "draft" | "published",
      history: [JSON.parse(JSON.stringify(stored.elements))],
    };
  }
  return {
    elements: [] as PageElement[],
    pageName: "صفحة جديدة",
    pageSlug: "new-page",
    pageStatus: "draft" as const,
    history: [[]] as PageElement[][],
  };
}

export function BuilderProvider({
  pageId,
  children,
}: {
  pageId: string;
  children: ReactNode;
}) {
  const initialState = useMemo(() => getInitialState(pageId), [pageId]);
  const [elements, setElements] = useState<PageElement[]>(initialState.elements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<PageElement[][]>(initialState.history);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [pageName, setPageName] = useState(initialState.pageName);
  const [pageSlug, setPageSlug] = useState(initialState.pageSlug);
  const [pageStatus, setPageStatus] = useState<"draft" | "published">(initialState.pageStatus);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const recordChange = useCallback(
    (newElements: PageElement[]) => {
      setElements(newElements);
      setIsDirty(true);
      setHistory((prev) => {
        const state = { history: prev, historyIndex };
        const result = pushHistory(newElements, state);
        setHistoryIndex(result.historyIndex);
        return result.history;
      });
    },
    [historyIndex]
  );

  const addElement = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const def = BLOCK_DEFINITIONS.find((b) => b.type === type);
      if (!def) return;
      const maxY = elements.reduce((max, el) => Math.max(max, el.position.y + el.size.height), 0);
      const newElement: PageElement = {
        id: generateId(),
        type: def.type,
        position: position ?? { x: 0, y: maxY + 20 },
        size: { ...def.defaultSize },
        props: JSON.parse(JSON.stringify(def.defaultProps)),
        visible: true,
        locked: false,
        name: def.label,
      };
      const newElements = [...elements, newElement];
      recordChange(newElements);
      setSelectedId(newElement.id);
    },
    [elements, recordChange]
  );

  const removeElement = useCallback(
    (id: string) => {
      const newElements = elements.filter((el) => el.id !== id);
      recordChange(newElements);
      if (selectedId === id) setSelectedId(null);
    },
    [elements, selectedId, recordChange]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<PageElement>) => {
      const newElements = elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      recordChange(newElements);
    },
    [elements, recordChange]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const el = elements.find((e) => e.id === id);
      if (!el) return;
      const duplicate: PageElement = {
        ...JSON.parse(JSON.stringify(el)),
        id: generateId(),
        position: { x: el.position.x + 20, y: el.position.y + 20 },
        name: el.name ? `${el.name} (نسخة)` : undefined,
      };
      const newElements = [...elements, duplicate];
      recordChange(newElements);
      setSelectedId(duplicate.id);
    },
    [elements, recordChange]
  );

  const moveElement = useCallback(
    (id: string, direction: "forward" | "backward") => {
      const idx = elements.findIndex((e) => e.id === id);
      if (idx === -1) return;
      const newElements = [...elements];
      if (direction === "forward" && idx < newElements.length - 1) {
        [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      } else if (direction === "backward" && idx > 0) {
        [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      }
      recordChange(newElements);
    },
    [elements, recordChange]
  );

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setElements(JSON.parse(JSON.stringify(history[newIndex])));
    setIsDirty(true);
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setElements(JSON.parse(JSON.stringify(history[newIndex])));
    setIsDirty(true);
  }, [canRedo, history, historyIndex]);

  const persistToStorage = useCallback(
    (status?: "draft" | "published") => {
      try {
        localStorage.setItem(
          getStorageKey(pageId),
          JSON.stringify({
            elements,
            pageName,
            pageSlug,
            pageStatus: status ?? pageStatus,
          })
        );
        setIsDirty(false);
      } catch {
        // storage full or unavailable
      }
    },
    [elements, pageName, pageSlug, pageStatus, pageId]
  );

  const saveDraft = useCallback(() => {
    setPageStatus("draft");
    persistToStorage("draft");
  }, [persistToStorage]);

  const publish = useCallback(() => {
    setPageStatus("published");
    persistToStorage("published");
  }, [persistToStorage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        persistToStorage();
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [isDirty, persistToStorage]);

  const selectedElement = useMemo(
    () => elements.find((e) => e.id === selectedId) ?? null,
    [elements, selectedId]
  );

  const value: BuilderContextValue = {
    elements,
    selectedId,
    device,
    zoom,
    history,
    historyIndex,
    isDirty,
    pageName,
    pageSlug,
    pageStatus,
    addElement,
    removeElement,
    updateElement,
    duplicateElement,
    moveElement,
    selectElement,
    clearSelection,
    setDevice,
    setZoom,
    setPageName,
    setPageSlug,
    saveDraft,
    publish,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedElement,
  };

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
