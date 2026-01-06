export type AppType = 'single-file' | 'project';

export interface App {
  id: string;
  name: string;
  description?: string;
  type: AppType;
  path: string;
  category?: string;
  favorite?: boolean;
}

export const apps: App[] = [
  // Games
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe Game',
    type: 'project',
    path: 'tictactoe/index.html',
    category: 'Games',
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Classic Snake Game with mobile controls',
    type: 'project',
    path: 'snake/index.html',
    category: 'Games',
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Match pairs of cards to test your memory',
    type: 'single-file',
    path: 'memory-game.html',
    category: 'Games',
  },
  // Tools
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple Calculator',
    type: 'single-file',
    path: 'calculator.html',
    category: 'Tools',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Stopwatch with lap timer',
    type: 'single-file',
    path: 'stopwatch.html',
    category: 'Tools',
  },
  {
    id: 'prompt-library',
    name: 'Prompt Library',
    description: 'Collection of useful prompts',
    type: 'single-file',
    path: 'promptLibrary.html',
    category: 'Tools',
  },
  // Productivity
  {
    id: 'todo',
    name: 'Todo List',
    description: 'Simple todo list with localStorage',
    type: 'single-file',
    path: 'todo.html',
    category: 'Productivity',
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    description: 'Take quick notes with color coding',
    type: 'single-file',
    path: 'notes.html',
    category: 'Productivity',
  },
];

export const appCategories = ['All', 'Games', 'Tools', 'Productivity'];
