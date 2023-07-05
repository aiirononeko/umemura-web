import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { db } from "../config";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";

export interface Customer {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
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
}

export interface AvailableTime {
  date: string;
  startTime: string;
  endTime: string;
}

// collectionが増えたらここに追加
type Collections = Customer | Course | Stuff | AvailableTime;

export async function getDocuments(
  collectionName: string
): Promise<DocumentData[]> {
  console.log("called");
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
  data: Collections,
  collectionName: string,
  uid: string
) {
  try {
    await setDoc(doc(db, collectionName, uid), {
      ...data,
    });
  } catch (error) {
    window.alert(error);
  }
}

export async function addDocument(
  data: Collections,
  collectionName: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  console.log("called");
  if (setLoading) {
    setLoading(true);
  }
  try {
    await addDoc(collection(db, collectionName), {
      ...data,
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

export async function addSubCollectionDocument(
  data: Collections,
  collectionName: string,
  documentId: string,
  subCollectionName: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  console.log("called");
  if (setLoading) {
    setLoading(true);
  }
  try {
    await addDoc(
      collection(db, collectionName, documentId, subCollectionName),
      {
        ...data,
      }
    );
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
