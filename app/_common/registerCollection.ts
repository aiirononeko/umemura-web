import { db } from "../firebase/config";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { type Customer, type Course, type Stuff } from "../_common/collection";

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
