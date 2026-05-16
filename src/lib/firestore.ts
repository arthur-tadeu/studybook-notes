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
    // Validação extra e log de integridade
    const pages = notebook.pages || [];
    console.log(`📡 [Firestore Save] Caderno: "${notebook.name}" | Páginas: ${pages.length}`);
    
    // Log do primeiro parágrafo de cada página para conferência
    pages.forEach((p, i) => {
      console.log(`   📄 Página ${i+1}: "${p.title}" | Conteúdo (preview): ${p.content?.substring(0, 30)}...`);
    });

    const notebookRef = doc(db, `users/${uid}/notebooks`, notebook.id);
    const dataToSave = JSON.parse(JSON.stringify({
      ...notebook,
      pages: pages // Garantir que as páginas estão no objeto
    }));
    
    await setDoc(notebookRef, dataToSave, { merge: true });
    return true;
  } catch (error: any) {
    console.error('❌ Erro crítico ao salvar no Firestore:', error.code, error.message);
    throw error;
  }
};

/**
 * Recupera todos os cadernos de um usuário
 */
export const getUserNotebooksFromFirestore = async (uid: string): Promise<Notebook[]> => {
  try {
    const notebooksRef = collection(db, `users/${uid}/notebooks`);
    const querySnapshot = await getDocs(notebooksRef);
    
    const notebooks = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Blindagem: Garantir que 'pages' sempre seja um array, mesmo que venha nulo do banco
        pages: Array.isArray(data.pages) ? data.pages : []
      } as Notebook;
    });

    console.log(`📥 [Firestore Load] ${notebooks.length} cadernos carregados.`);
    return notebooks.sort((a, b) => b.createdAt - a.createdAt);
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
