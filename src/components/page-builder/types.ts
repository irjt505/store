export type DeviceType = "desktop" | "tablet" | "mobile";
export type ElementType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "columns"
  | "hero"
  | "features"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "divider"
  | "spacer"
  | "video"
  | "countdown"
  | "social-proof";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PageElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  props: Record<string, unknown>;
  children?: PageElement[];
  locked?: boolean;
  visible?: boolean;
  name?: string;
}

export interface PageBuilderState {
  elements: PageElement[];
  selectedId: string | null;
  device: DeviceType;
  zoom: number;
  history: PageElement[][];
  historyIndex: number;
  isDirty: boolean;
  pageName: string;
  pageSlug: string;
  pageStatus: "draft" | "published";
}

export interface BlockDefinition {
  type: ElementType;
  label: string;
  icon: string;
  category: "layout" | "content" | "commerce" | "media" | "social";
  defaultProps: Record<string, unknown>;
  defaultSize: Size;
}
