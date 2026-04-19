export interface User {
  uid: string;
  name: string;
  email: string;
  picture: string;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  fontFamily?: string;
  color?: string;
  drawingData?: string;
}

export interface Notebook {
  id: string;
  name: string;
  pages: Page[];
  createdAt: number;
  isFavorite?: boolean;
}

export type AppState = {
  user: User | null;
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activePageId: string | null;
  searchQuery: string;
};
