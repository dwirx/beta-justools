// =============================================================
// APP REGISTRY - Full Auto-Detection untuk HTML & TSX Apps
// =============================================================
// 
// 🚀 CARA MENAMBAH APP BARU (ZERO CONFIG!):
// 
// TSX APP:
//   1. Buat file di src/apps/NamaApp.tsx
//   2. Export default component
//   3. (Opsional) Export appMeta untuk kustomisasi
//   4. SELESAI! Otomatis muncul di My Apps
//
// HTML APP:
//   1. Taruh file di public/justhtml/namaapp.html
//   2. ATAU buat folder public/justhtml/namaapp/index.html
//   3. SELESAI! Otomatis muncul di My Apps
//
// =============================================================

import { lazy, ComponentType } from 'react';

export type AppType = 'single-file' | 'project' | 'tsx';
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

const tsxModules = import.meta.glob<{ 
  default: ComponentType; 
  appMeta?: TsxAppMeta 
}>('/src/apps/*.tsx');

const buildTsxApps = (): AppMeta[] => {
  return Object.entries(tsxModules).map(([path, importFn]) => {
    // Extract filename: /src/apps/HelloWorld.tsx -> HelloWorld
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'unknown';
    const id = filename.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    return {
      id: `tsx-${id}`,
      name: toReadableName(filename),
      description: `TSX App: ${toReadableName(filename)}`,
      type: 'tsx' as AppType,
      path: path,
      category: 'Other' as AppCategory,
      icon: '⚛️',
      featured: false,
      component: lazy(importFn),
    };
  });
};

// =============================================================
// AUTO-DETECT HTML APPS dari public/justhtml/
// =============================================================
// Menggunakan import.meta.glob untuk scan otomatis

const htmlFiles = import.meta.glob('/public/justhtml/*.html', { query: '?url', import: 'default' });
const htmlProjects = import.meta.glob('/public/justhtml/*/index.html', { query: '?url', import: 'default' });

const buildHtmlApps = (): AppMeta[] => {
  const apps: AppMeta[] = [];
  
  // Single HTML files
  Object.keys(htmlFiles).forEach(path => {
    const filename = path.split('/').pop()?.replace('.html', '') || 'unknown';
    const id = filename.toLowerCase();
    const custom = htmlCustomizations[id] || htmlCustomizations[filename] || {};
    
    apps.push({
      id: `html-${id}`,
      name: custom.name || toReadableName(filename),
      description: custom.description || `HTML App: ${toReadableName(filename)}`,
      type: 'single-file',
      path: `${filename}.html`,
      category: custom.category || 'Other',
      icon: custom.icon || '📄',
      featured: custom.featured || false,
    });
  });
  
  // Project folders with index.html
  Object.keys(htmlProjects).forEach(path => {
    // /public/justhtml/snake/index.html -> snake
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    const id = folderName.toLowerCase();
    const custom = htmlCustomizations[id] || htmlCustomizations[folderName] || {};
    
    apps.push({
      id: `html-${id}`,
      name: custom.name || toReadableName(folderName),
      description: custom.description || `HTML Project: ${toReadableName(folderName)}`,
      type: 'project',
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
// Untuk override nama, deskripsi, kategori, icon

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
// HELPER: Convert filename to readable name
// =============================================================

const toReadableName = (filename: string): string => {
  return filename
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
    .replace(/[-_]/g, ' ') // kebab-case & snake_case
    .replace(/\b\w/g, c => c.toUpperCase()) // Title Case
    .trim();
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

// Lazy initialization
const getRegistry = () => buildAppRegistry();

// =============================================================
// ASYNC LOADING untuk TSX Apps dengan metadata
// =============================================================

export const loadTsxAppWithMeta = async (app: AppMeta): Promise<AppMeta> => {
  if (app.type !== 'tsx') return app;
  
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
  if (app.type === 'tsx') {
    return `/apps/${app.id.replace('tsx-', '')}`;
  }
  return `/justhtml/${app.path}`;
};

// For dynamic import
export { tsxModules };

export default getRegistry();
