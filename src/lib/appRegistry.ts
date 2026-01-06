// =============================================================
// APP REGISTRY - Auto-detection untuk HTML Apps
// =============================================================
// 
// CARA MENAMBAH APP BARU:
// 
// 1. SINGLE FILE: Taruh file HTML di public/justhtml/
//    Contoh: public/justhtml/calculator.html
//    
// 2. PROJECT FOLDER: Buat folder dengan index.html
//    Contoh: public/justhtml/snake/index.html
//    
// 3. Tambahkan metadata di bawah ini (WAJIB)
//
// =============================================================

export type AppType = 'single-file' | 'project';
export type AppCategory = 'Games' | 'Tools' | 'Productivity' | 'Education' | 'Entertainment';

export interface AppMeta {
  id: string;
  name: string;
  description: string;
  type: AppType;
  path: string;
  category: AppCategory;
  icon?: string;
  featured?: boolean;
}

// =============================================================
// DAFTAR APPS - Tambah entry baru di sini!
// =============================================================

const appRegistry: AppMeta[] = [
  // ===== GAMES =====
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe game for two players',
    type: 'project',
    path: 'tictactoe/index.html',
    category: 'Games',
    icon: '⭕',
    featured: true,
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Classic Snake game with mobile touch controls',
    type: 'project',
    path: 'snake/index.html',
    category: 'Games',
    icon: '🐍',
    featured: true,
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Match pairs of cards to test your memory',
    type: 'single-file',
    path: 'memory-game.html',
    category: 'Games',
    icon: '🃏',
  },

  // ===== TOOLS =====
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple calculator for basic math operations',
    type: 'single-file',
    path: 'calculator.html',
    category: 'Tools',
    icon: '🧮',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Stopwatch with lap timer functionality',
    type: 'single-file',
    path: 'stopwatch.html',
    category: 'Tools',
    icon: '⏱️',
  },
  {
    id: 'prompt-library',
    name: 'Prompt Library',
    description: 'Collection of useful AI prompts',
    type: 'single-file',
    path: 'promptLibrary.html',
    category: 'Tools',
    icon: '💬',
  },

  // ===== PRODUCTIVITY =====
  {
    id: 'todo',
    name: 'Todo List',
    description: 'Simple todo list with localStorage persistence',
    type: 'single-file',
    path: 'todo.html',
    category: 'Productivity',
    icon: '✅',
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    description: 'Take quick notes with color coding',
    type: 'single-file',
    path: 'notes.html',
    category: 'Productivity',
    icon: '📝',
  },
];

// =============================================================
// HELPER FUNCTIONS
// =============================================================

export const getAppRegistry = () => appRegistry;

export const getAppById = (id: string) => 
  appRegistry.find(app => app.id === id);

export const getAppsByCategory = (category: AppCategory) => 
  appRegistry.filter(app => app.category === category);

export const getFeaturedApps = () => 
  appRegistry.filter(app => app.featured);

export const searchApps = (query: string) => {
  const q = query.toLowerCase();
  return appRegistry.filter(app => 
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
];

export const getAppUrl = (app: AppMeta) => `/justhtml/${app.path}`;

export default appRegistry;
