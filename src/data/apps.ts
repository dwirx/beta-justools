export type AppType = 'single-file' | 'project';

export interface App {
  id: string;
  name: string;
  description?: string;
  type: AppType;
  path: string; // For single file: game.html, for project: facedetection/index.html
  category?: string;
  favorite?: boolean;
}

// Sample apps - users can add their own
export const apps: App[] = [
  {
    id: 'prompt-library',
    name: 'promptLibrary.html',
    description: 'Prompt Library Tool',
    type: 'single-file',
    path: 'promptLibrary.html',
    category: 'Tools',
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe Game',
    type: 'project',
    path: 'tictactoe/index.html',
    category: 'Games',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple Calculator',
    type: 'single-file',
    path: 'calculator.html',
    category: 'Tools',
  },
];

export const appCategories = ['All', 'Games', 'Tools', 'Mind'];
