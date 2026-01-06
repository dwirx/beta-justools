// =============================================================
// APP REGISTRY - Full Auto-Detection untuk HTML & TSX Apps
// =============================================================
// 
// 🚀 CARA MENAMBAH APP BARU (ZERO CONFIG!):
// 
// ============ TSX APPS ============
// 
// SINGLE FILE:
//   src/apps/HelloWorld.tsx
//   → Otomatis jadi single TSX app
//
// PROJECT FOLDER:
//   src/apps/my-game/index.tsx (atau App.tsx)
//   src/apps/my-game/components/...
//   → Otomatis jadi TSX project
//
// ============ HTML APPS ============
// 
// SINGLE FILE:
//   public/justhtml/calculator.html
//   → Otomatis jadi single HTML app
//
// PROJECT FOLDER:
//   public/justhtml/snake/index.html
//   public/justhtml/snake/script.js
//   → Otomatis jadi HTML project
//
// ============ KUSTOMISASI ============
// 
// TSX: Export appMeta di file utama
// HTML: Tambah di htmlCustomizations
//
// =============================================================

import { lazy, ComponentType } from 'react';

export type AppType = 'html-single' | 'html-project' | 'tsx-single' | 'tsx-project';
export type AppCategory = 'Games' | 'Tools' | 'Productivity' | 'Education' | 'Entertainment' | 'Other';

export interface AppMeta {
  id: string;
  name: string;
  description: string;
  type: AppType;
  path: string;
  category: AppCategory;
  icon?: string;
  featured?: boolean;
  component?: ComponentType;
}

export interface TsxAppMeta {
  name?: string;
  description?: string;
  category?: AppCategory;
  icon?: string;
  featured?: boolean;
}

// =============================================================
// AUTO-DETECT TSX APPS dari src/apps/
// =============================================================

// Single TSX files: src/apps/HelloWorld.tsx
const tsxSingleFiles = import.meta.glob<{ 
  default: ComponentType; 
  appMeta?: TsxAppMeta 
}>('/src/apps/*.tsx');

// Project folders: src/apps/my-game/index.tsx atau App.tsx
const tsxProjectIndex = import.meta.glob<{ 
  default: ComponentType; 
  appMeta?: TsxAppMeta 
}>('/src/apps/*/index.tsx');

const tsxProjectApp = import.meta.glob<{ 
  default: ComponentType; 
  appMeta?: TsxAppMeta 
}>('/src/apps/*/App.tsx');

// Combine all TSX modules
export const tsxModules: Record<string, () => Promise<{ default: ComponentType; appMeta?: TsxAppMeta }>> = {
  ...tsxSingleFiles,
  ...tsxProjectIndex,
  ...tsxProjectApp,
};

const buildTsxApps = (): AppMeta[] => {
  const apps: AppMeta[] = [];
  const processedFolders = new Set<string>();
  
  // Process single files
  Object.entries(tsxSingleFiles).forEach(([path, importFn]) => {
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'unknown';
    const id = toKebabCase(filename);
    
    apps.push({
      id: `tsx-${id}`,
      name: toReadableName(filename),
      description: `Single TSX app`,
      type: 'tsx-single',
      path: path,
      category: 'Other',
      icon: '⚛️',
      featured: false,
      component: lazy(importFn),
    });
  });
  
  // Process project folders (index.tsx)
  Object.entries(tsxProjectIndex).forEach(([path, importFn]) => {
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    
    if (processedFolders.has(folderName)) return;
    processedFolders.add(folderName);
    
    const id = toKebabCase(folderName);
    
    apps.push({
      id: `tsx-${id}`,
      name: toReadableName(folderName),
      description: `TSX project with multiple files`,
      type: 'tsx-project',
      path: path,
      category: 'Other',
      icon: '📦',
      featured: false,
      component: lazy(importFn),
    });
  });
  
  // Process project folders (App.tsx) - only if not already processed
  Object.entries(tsxProjectApp).forEach(([path, importFn]) => {
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    
    if (processedFolders.has(folderName)) return;
    processedFolders.add(folderName);
    
    const id = toKebabCase(folderName);
    
    apps.push({
      id: `tsx-${id}`,
      name: toReadableName(folderName),
      description: `TSX project with multiple files`,
      type: 'tsx-project',
      path: path,
      category: 'Other',
      icon: '📦',
      featured: false,
      component: lazy(importFn),
    });
  });
  
  return apps;
};

// =============================================================
// AUTO-DETECT HTML APPS dari public/justhtml/
// =============================================================

// Single HTML files
const htmlSingleFiles = import.meta.glob('/public/justhtml/*.html', { query: '?url', import: 'default' });

// Project folders with index.html
const htmlProjectFiles = import.meta.glob('/public/justhtml/*/index.html', { query: '?url', import: 'default' });

const buildHtmlApps = (): AppMeta[] => {
  const apps: AppMeta[] = [];
  
  // Single HTML files
  Object.keys(htmlSingleFiles).forEach(path => {
    const filename = path.split('/').pop()?.replace('.html', '') || 'unknown';
    const id = toKebabCase(filename);
    const custom = htmlCustomizations[id] || htmlCustomizations[filename] || {};
    
    apps.push({
      id: `html-${id}`,
      name: custom.name || toReadableName(filename),
      description: custom.description || `Single HTML file`,
      type: 'html-single',
      path: `${filename}.html`,
      category: custom.category || 'Other',
      icon: custom.icon || '📄',
      featured: custom.featured || false,
    });
  });
  
  // Project folders with index.html
  Object.keys(htmlProjectFiles).forEach(path => {
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    const id = toKebabCase(folderName);
    const custom = htmlCustomizations[id] || htmlCustomizations[folderName] || {};
    
    apps.push({
      id: `html-${id}`,
      name: custom.name || toReadableName(folderName),
      description: custom.description || `HTML project with multiple files`,
      type: 'html-project',
      path: `${folderName}/index.html`,
      category: custom.category || 'Other',
      icon: custom.icon || '📁',
      featured: custom.featured || false,
    });
  });
  
  return apps;
};

// =============================================================
// KUSTOMISASI HTML APPS (Opsional)
// =============================================================

interface HtmlCustomization {
  name?: string;
  description?: string;
  category?: AppCategory;
  icon?: string;
  featured?: boolean;
}

const htmlCustomizations: Record<string, HtmlCustomization> = {
  // ===== GAMES =====
  'tictactoe': {
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe game for two players',
    category: 'Games',
    icon: '⭕',
    featured: true,
  },
  'snake': {
    name: 'Snake Game',
    description: 'Classic Snake game with mobile touch controls',
    category: 'Games',
    icon: '🐍',
    featured: true,
  },
  'memory-game': {
    name: 'Memory Game',
    description: 'Match pairs of cards to test your memory',
    category: 'Games',
    icon: '🃏',
  },

  // ===== TOOLS =====
  'calculator': {
    name: 'Calculator',
    description: 'Simple calculator for basic math operations',
    category: 'Tools',
    icon: '🧮',
  },
  'stopwatch': {
    name: 'Stopwatch',
    description: 'Stopwatch with lap timer functionality',
    category: 'Tools',
    icon: '⏱️',
  },
  'promptlibrary': {
    name: 'Prompt Library',
    description: 'Collection of useful AI prompts',
    category: 'Tools',
    icon: '💬',
  },

  // ===== PRODUCTIVITY =====
  'todo': {
    name: 'Todo List',
    description: 'Simple todo list with localStorage persistence',
    category: 'Productivity',
    icon: '✅',
  },
  'notes': {
    name: 'Quick Notes',
    description: 'Take quick notes with color coding',
    category: 'Productivity',
    icon: '📝',
  },
};

// =============================================================
// HELPER FUNCTIONS
// =============================================================

const toReadableName = (filename: string): string => {
  return filename
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
};

const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

// =============================================================
// BUILD COMBINED REGISTRY
// =============================================================

let _appRegistry: AppMeta[] | null = null;

const buildAppRegistry = (): AppMeta[] => {
  if (_appRegistry) return _appRegistry;
  
  const htmlApps = buildHtmlApps();
  const tsxApps = buildTsxApps();
  
  _appRegistry = [...htmlApps, ...tsxApps];
  return _appRegistry;
};

const getRegistry = () => buildAppRegistry();

// =============================================================
// ASYNC LOADING untuk TSX Apps dengan metadata
// =============================================================

export const loadTsxAppWithMeta = async (app: AppMeta): Promise<AppMeta> => {
  if (!app.type.startsWith('tsx')) return app;
  
  try {
    const importFn = tsxModules[app.path];
    if (!importFn) return app;
    
    const module = await importFn();
    const meta = module.appMeta;
    
    if (meta) {
      return {
        ...app,
        name: meta.name || app.name,
        description: meta.description || app.description,
        category: meta.category || app.category,
        icon: meta.icon || app.icon,
        featured: meta.featured ?? app.featured,
        component: module.default,
      };
    }
    
    return { ...app, component: module.default };
  } catch {
    return app;
  }
};

// =============================================================
// EXPORT FUNCTIONS
// =============================================================

export const getAppRegistry = () => getRegistry();

export const getAppById = (id: string) => 
  getRegistry().find(app => app.id === id);

export const getAppsByCategory = (category: AppCategory) => 
  getRegistry().filter(app => app.category === category);

export const getFeaturedApps = () => 
  getRegistry().filter(app => app.featured);

export const searchApps = (query: string) => {
  const q = query.toLowerCase();
  return getRegistry().filter(app => 
    app.name.toLowerCase().includes(q) ||
    app.description.toLowerCase().includes(q) ||
    app.category.toLowerCase().includes(q)
  );
};

export const getAppCategories = (): AppCategory[] => [
  'Games',
  'Tools', 
  'Productivity',
  'Education',
  'Entertainment',
  'Other',
];

export const getAppUrl = (app: AppMeta): string => {
  if (app.type.startsWith('tsx')) {
    return `/apps/${app.id.replace('tsx-', '')}`;
  }
  return `/justhtml/${app.path}`;
};

// Type helpers
export const isHtmlApp = (app: AppMeta) => app.type.startsWith('html');
export const isTsxApp = (app: AppMeta) => app.type.startsWith('tsx');
export const isProjectApp = (app: AppMeta) => app.type.endsWith('-project');
export const isSingleFileApp = (app: AppMeta) => app.type.endsWith('-single');

// Type labels
export const getTypeLabel = (type: AppType): string => {
  switch (type) {
    case 'html-single': return 'HTML';
    case 'html-project': return 'HTML Project';
    case 'tsx-single': return 'React';
    case 'tsx-project': return 'React Project';
    default: return 'App';
  }
};

export const getTypeIcon = (type: AppType): string => {
  switch (type) {
    case 'html-single': return '📄';
    case 'html-project': return '📁';
    case 'tsx-single': return '⚛️';
    case 'tsx-project': return '📦';
    default: return '📱';
  }
};

export default getRegistry();
