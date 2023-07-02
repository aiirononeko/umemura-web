import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { db } from "../config";
import { doc, setDoc, collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

export interface Customer {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface Course {
  title: string;
  time: string;
  description: string;
  amount: string;
}

export interface Stuff {
  firstName: string;
  lastName: string;
  gender: string;
  profile: string;
  email: string;
  password: string;
}

// collectionが増えたらここに追加
type Collections = Customer | Course | Stuff;

export async function getDocuments(collectionName: string): Promise<DocumentData[]> {
  try {
    const docRef = await getDocs(collection(db, collectionName));
    const documents = docRef.docs.map((doc) => doc.data());
    return documents;
  } catch (e) {
    console.error("Error adding document: ", e);
    return [];
  }
}

export async function addDocumentWithUid(
  targetCollection: Collections,
  collectionName: string,
  uid: string
) {
  try {
    await setDoc(doc(db, collectionName, uid), {
      ...targetCollection,
    });
  } catch (error) {
    window.alert(error);
  }
}

export async function addDocument(
  targetCollection: Collections,
  collectionName: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  if (setLoading) {
    setLoading(true);
  }
  try {
    await addDoc(collection(db, collectionName), {
      ...targetCollection,
    });
    window.alert("保存しました");
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
    window.alert("保存に失敗しました");
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  }
}

function offLoadingAndBack(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string
) {
  setLoading(false);
  router.push(backPath);
}
