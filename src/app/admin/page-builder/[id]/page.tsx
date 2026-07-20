"use client";

import { use, Suspense } from "react";
import { BuilderProvider } from "@/components/page-builder/BuilderContext";
import { Toolbar } from "@/components/page-builder/Toolbar";
import { LayersPanel } from "@/components/page-builder/LayersPanel";
import { Canvas } from "@/components/page-builder/Canvas";
import { PropertiesPanel } from "@/components/page-builder/PropertiesPanel";

function BuilderContent({ id }: { id: string }) {
  return (
    <BuilderProvider pageId={id}>
      <div className="flex flex-col h-screen">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <LayersPanel />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </BuilderProvider>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">جاري تحميل المحرر...</p>
      </div>
    </div>
  );
}

export default function PageBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <BuilderContent id={id} />
    </Suspense>
  );
}
