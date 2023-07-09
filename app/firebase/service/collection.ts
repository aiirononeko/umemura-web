import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { db } from "../config";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  DocumentData,
  Timestamp,
  deleteDoc,
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
  id?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  profile?: string;
  email: string;
}

export interface AvailableTime {
  id: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  customerId: string;
  stuffId: string;
  course: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
}

// collectionが増えたらここに追加
type Collections = Customer | Course | Stuff | AvailableTime | Reservation;

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

export async function getSubcollectionDocuments(
  collectionName: string,
  documentId: string,
  subCollectionName: string
): Promise<DocumentData[]> {
  console.log("called");
  try {
    const docRef = await getDocs(
      collection(db, collectionName, documentId, subCollectionName)
    );
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
    const docRef = collection(
      db,
      collectionName,
      documentId,
      subCollectionName
    );
    const result = await addDoc(docRef, {
      ...data,
    });
    const subCollectionRef = doc(
      db,
      collectionName,
      documentId,
      subCollectionName,
      result.id
    );
    await setDoc(
      subCollectionRef,
      {
        id: result.id,
      },
      { merge: true }
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

export async function updateDocument(
  data: Collections,
  collectionName: string,
  documentId: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  console.log("called");
  if (setLoading) {
    setLoading(true);
  }
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(
      docRef,
      {
        ...data,
      },
      { merge: true }
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

export async function updateSubCollectionDocument(
  data: Collections,
  collectionName: string,
  documentId: string,
  subCollectionName: string,
  subDocumentId: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  console.log("called");
  if (setLoading) {
    setLoading(true);
  }
  try {
    const docRef = doc(
      db,
      collectionName,
      documentId,
      subCollectionName,
      subDocumentId
    );
    await setDoc(
      docRef,
      {
        ...data,
      },
      { merge: true }
    );
    window.alert("保存しました");
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
    window.alert("保存に失敗しました");
    console.error(e);
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  }
}

export async function deleteSubCollectionDocument(
  collectionName: string,
  documentId: string,
  subCollectionName: string,
  subCollectionId: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  router?: AppRouterInstance,
  backPath?: string
) {
  console.log("called");
  if (setLoading) {
    setLoading(true);
  }
  try {
    const docRef = doc(
      db,
      collectionName,
      documentId,
      subCollectionName,
      subCollectionId
    );
    await deleteDoc(docRef);
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
  router?: AppRouterInstance,
  backPath?: string
) {
  setLoading(false);
  if (router && backPath) {
    router.push(backPath);
  }
}
