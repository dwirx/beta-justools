import { ComponentType } from 'react';

export type AppCategory = 'Games' | 'Tools' | 'Productivity' | 'Education' | 'Entertainment' | 'Other';
export type AppType = 'tsx-single' | 'tsx-project' | 'html-single' | 'html-project';

export interface AppMeta {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  type: AppType;
  path: string;
  icon?: string;
  featured?: boolean;
  addedAt?: string;
}

type AppModule = {
  default: ComponentType;
  appMeta?: Partial<Pick<AppMeta, 'name' | 'description' | 'category' | 'icon' | 'featured' | 'addedAt'>>;
};
type AppMetaModule = {
  appMeta?: AppModule['appMeta'];
};

interface HtmlCustomization {
  name?: string;
  description?: string;
  category?: AppCategory;
  icon?: string;
  featured?: boolean;
  addedAt?: string;
}

const tsxSingleModules = import.meta.glob('/src/apps/*.tsx') as Record<string, () => Promise<AppModule>>;
const tsxProjectIndexModules = import.meta.glob('/src/apps/*/index.tsx') as Record<string, () => Promise<AppModule>>;
const tsxProjectAppModules = import.meta.glob('/src/apps/*/App.tsx') as Record<string, () => Promise<AppModule>>;

export const tsxModules: Record<string, () => Promise<AppModule>> = {
  ...tsxSingleModules,
  ...tsxProjectIndexModules,
  ...tsxProjectAppModules,
};

const tsxSingleMetaModules = import.meta.glob('/src/apps/*.tsx', { eager: true }) as Record<string, AppMetaModule>;
const tsxProjectIndexMetaModules = import.meta.glob('/src/apps/*/index.tsx', { eager: true }) as Record<string, AppMetaModule>;
const tsxProjectAppMetaModules = import.meta.glob('/src/apps/*/App.tsx', { eager: true }) as Record<string, AppMetaModule>;

const tsxMetaModules: Record<string, AppMetaModule> = {
  ...tsxSingleMetaModules,
  ...tsxProjectIndexMetaModules,
  ...tsxProjectAppMetaModules,
};

const htmlPaths = [
  'addition-game.html',
  'calculator.html',
  'cintah.html',
  'hello-hades/index.html',
  'javasandi.html',
  'memory-game.html',
  'notes.html',
  'promptLibrary.html',
  'quiz-game/index.html',
  'sandiwana.html',
  'semesta.html',
  'snake-ai/index.html',
  'snake/index.html',
  'stopwatch.html',
  'tictactoe/index.html',
  'todo.html',
  'vibecode/index.html',
  'vibecode/vibecode.html',
] as const;

export const htmlModules: Record<string, true> = Object.fromEntries(
  htmlPaths.map((path) => [`/public/justhtml/${path}`, true]),
) as Record<string, true>;

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();

const toReadableName = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const makeDefaultIcon = (seed: string): string => {
  const icons = ['🎮', '🧩', '⚙️', '📱', '🚀', '✨', '🎯', '🛠️', '🧠', '📚'];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return icons[Math.abs(hash) % icons.length];
};

const getTsxIdFromPath = (modulePath: string): string => {
  if (modulePath.endsWith('/index.tsx') || modulePath.endsWith('/App.tsx')) {
    const parts = modulePath.split('/');
    return toKebabCase(parts[parts.length - 2]);
  }

  const filename = modulePath.split('/').pop()?.replace('.tsx', '') ?? 'app';
  return toKebabCase(filename);
};

const getTsxDefaultName = (modulePath: string): string => {
  if (modulePath.endsWith('/index.tsx') || modulePath.endsWith('/App.tsx')) {
    const parts = modulePath.split('/');
    return toReadableName(parts[parts.length - 2]);
  }

  const filename = modulePath.split('/').pop()?.replace('.tsx', '') ?? 'App';
  return toReadableName(filename);
};

const getHtmlPathFromModule = (modulePath: string): string =>
  modulePath
    .replace('/public/justhtml/', '')
    .replace(/^justhtml\//, '');

const getHtmlIdFromPath = (htmlPath: string): string => {
  if (htmlPath.endsWith('/index.html')) {
    const parts = htmlPath.split('/');
    return toKebabCase(parts[parts.length - 2]);
  }

  return toKebabCase(htmlPath.replace('.html', '').replace(/\//g, '-'));
};

export const htmlCustomizations: Record<string, HtmlCustomization> = {
  'addition-game': {
    name: 'Game Penjumlahan (HTML)',
    description: 'Game interaktif untuk latihan penjumlahan berbasis HTML.',
    category: 'Education',
    icon: '➕',
    addedAt: '2026-02-13',
  },
  'hello-hades': {
    name: 'Hello Hades (HTML)',
    category: 'Entertainment',
  },
};

export const reactCustomizations = [
  {
    name: 'Game Penjumlahan (React)',
    path: '/apps/addition-game',
    addedAt: '2026-02-13',
  },
];

const buildTsxRegistry = (): AppMeta[] =>
  Object.keys(tsxModules)
    .sort((a, b) => a.localeCompare(b))
    .map((modulePath) => {
      const id = getTsxIdFromPath(modulePath);
      const defaultsName = getTsxDefaultName(modulePath);
      const meta = tsxMetaModules[modulePath]?.appMeta;
      const name = meta?.name ?? defaultsName;
      const type: AppType =
        modulePath.endsWith('/index.tsx') || modulePath.endsWith('/App.tsx')
          ? 'tsx-project'
          : 'tsx-single';

      return {
        id: `tsx-${id}`,
        name,
        description: meta?.description ?? `${defaultsName} app`,
        category: meta?.category ?? 'Other',
        type,
        path: modulePath,
        icon: meta?.icon ?? makeDefaultIcon(name),
        featured: meta?.featured ?? false,
        addedAt: meta?.addedAt,
      };
    });

const buildHtmlRegistry = (): AppMeta[] =>
  Object.keys(htmlModules)
    .sort((a, b) => a.localeCompare(b))
    .map((modulePath) => {
      const htmlPath = getHtmlPathFromModule(modulePath);
      const id = getHtmlIdFromPath(htmlPath);
      const fallbackName = toReadableName(id);
      const customization = htmlCustomizations[id];
      const type: AppType = htmlPath.endsWith('/index.html') ? 'html-project' : 'html-single';

      return {
        id: `html-${id}`,
        name: customization?.name ?? fallbackName,
        description: customization?.description ?? `${fallbackName} app`,
        category: customization?.category ?? 'Other',
        type,
        path: htmlPath,
        icon: customization?.icon ?? makeDefaultIcon(id),
        featured: customization?.featured ?? false,
        addedAt: customization?.addedAt,
      };
    });

let _registryCache: AppMeta[] | null = null;

export const getAppRegistry = (): AppMeta[] => {
  if (_registryCache) {
    return _registryCache;
  }

  _registryCache = [...buildTsxRegistry(), ...buildHtmlRegistry()];
  return _registryCache;
};

export const getAppById = (id: string): AppMeta | undefined => getAppRegistry().find((app) => app.id === id);

export const getAppCategories = (): AppCategory[] => {
  const categories = new Set<AppCategory>(getAppRegistry().map((app) => app.category));
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};

export const isTsxApp = (app: AppMeta): boolean => app.type.startsWith('tsx');

export const isProjectApp = (app: AppMeta): boolean => app.type.endsWith('project');

export const getTypeLabel = (type: AppType): string => {
  if (type.startsWith('tsx')) return 'React';
  return 'HTML';
};

export const getAppUrl = (app: AppMeta): string => {
  if (isTsxApp(app)) {
    return `/apps/${app.id.replace('tsx-', '')}`;
  }

  return `/justhtml/${app.path}`;
};

export const getAppAddedAtTimestamp = (app: Pick<AppMeta, 'addedAt'>): number | null => {
  if (!app.addedAt) return null;

  const timestamp = new Date(app.addedAt).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const loadTsxAppWithMeta = async (app: AppMeta): Promise<AppMeta> => {
  if (!isTsxApp(app)) {
    return app;
  }

  const importFn = tsxModules[app.path];
  if (!importFn) {
    return app;
  }

  try {
    const module = await importFn();
    const meta = module.appMeta;

    if (!meta) {
      return app;
    }

    return {
      ...app,
      name: meta.name ?? app.name,
      description: meta.description ?? app.description,
      category: meta.category ?? app.category,
      icon: meta.icon ?? app.icon,
      featured: meta.featured ?? app.featured,
      addedAt: meta.addedAt ?? app.addedAt,
    };
  } catch {
    return app;
  }
};
