import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Notebook } from '../types';

/**
 * Salva ou atualiza um caderno no Firestore
 */
export const saveNotebookToFirestore = async (uid: string, notebook: Notebook) => {
  try {
    const notebookRef = doc(db, `users/${uid}/notebooks`, notebook.id);
    await setDoc(notebookRef, notebook, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar caderno no Firestore:', error);
    throw error;
  }
};

/**
 * Recupera todos os cadernos de um usuário
 */
export const getUserNotebooksFromFirestore = async (uid: string): Promise<Notebook[]> => {
  try {
    const notebooksRef = collection(db, `users/${uid}/notebooks`);
    const q = query(notebooksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Notebook);
  } catch (error) {
    console.error('Erro ao buscar cadernos no Firestore:', error);
    return [];
  }
};

/**
 * Exclui um caderno do Firestore
 */
export const deleteNotebookFromFirestore = async (uid: string, notebookId: string) => {
  try {
    const notebookRef = doc(db, `users/${uid}/notebooks`, notebookId);
    await deleteDoc(notebookRef);
  } catch (error) {
    console.error('Erro ao excluir caderno no Firestore:', error);
    throw error;
  }
};
