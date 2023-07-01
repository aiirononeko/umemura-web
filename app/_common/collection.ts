import { db } from "../firebase/config";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export interface Customer {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export interface Course {
  title: string;
  time: string;
  description: string;
  amount: number;
}

export interface Stuff {
  firstName: string,
  lastName: string,
  gender: string,
  profile: string,
  email: string,
  password: string,
};


// collectionが増えたら追加する
export async function addCollectionWithUid(targetCollection: Customer | Course | Stuff, collectionName: string, uid: string) {
  try {
    await setDoc(doc(db, collectionName, uid), {
      ...targetCollection,
    });
  } catch (error) {
    window.alert(error);
  }
}

// collectionが増えたら追加する
export async function addCollection(targetCollection: Customer | Course | Stuff, collectionName: string) {
  try {
    await addDoc(collection(db, collectionName), {
      ...targetCollection,
    });
    window.alert('保存しました');
  } catch (e) {
    window.alert('保存に失敗しました');
  }
}
