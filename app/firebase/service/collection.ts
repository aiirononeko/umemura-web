import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { db } from "../config";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";

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

// FIXME: any型をなんとかしたい
export async function getCollection(
  collectionName: string,
  setCollection: any
) {
  try {
    const docRef = await getDocs(collection(db, collectionName));
    const targetData = docRef.docs.map((doc) => doc.data());
    setCollection(targetData);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getDocuments(collectionName: string): Promise<any> {
  try {
    const docRef = await getDocs(collection(db, collectionName));
    return docRef.docs.map((doc) => doc.data());
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addCollectionWithUid(
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

export async function addCollection(
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
