import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { db, storage } from "../config";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  DocumentData,
  Timestamp,
  deleteDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Dispatch, SetStateAction } from "react";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  time: string;
  description: string;
  amount: string;
  discount: string;
  createdAt: Date;
}

export interface Stuff {
  id?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  profile?: string;
  profileImageUrl?: string;
  email?: string;
}

export interface AvailableTime {
  id: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
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
  try {
    const q = query(collection(db, collectionName), orderBy("createdAt"));
    const docRef = await getDocs(q);
    const documents = docRef.docs.map((doc) => doc.data());
    return documents;
  } catch (e) {
    console.error("Error adding document: ", e);
    return [];
  }
}

export async function getDocument(
  collectionName: string,
  documentId: string
): Promise<DocumentData> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const document = await getDoc(docRef);
    return document;
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
  if (setLoading) {
    setLoading(true);
  }
  try {
    const collectionRef = collection(db, collectionName);
    const result = await addDoc(collectionRef, {
      ...data,
    });
    const docRef = doc(db, collectionName, result.id);
    await setDoc(
      docRef,
      {
        id: result.id,
      },
      { merge: true }
    );
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
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
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  }
}

export async function uploadImage(img: File, imgName: string) {
  const storageRef = ref(storage, imgName);
  uploadBytes(storageRef, img)
    .then((snapshot) => {
      console.log("success");
      console.log(snapshot);
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });
}

async function getImageUrl(imgName: string) {
  const folderPath = "gs://holisticbeautysalon-c978e.appspot.com/";
  const storageRef = ref(storage, folderPath + imgName);
  const res = await getDownloadURL(storageRef)
    .then((url) => {
      return url;
    })
    .catch((error) => {
      console.log(error);
      return "";
    });
  return res;
}

export async function updateStuff(
  profile: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  uid: string,
  router: AppRouterInstance,
  backPath: string,
  img?: File,
  imgName?: string
) {
  setLoading(true);
  if (img != undefined && imgName != undefined) {
    await uploadImage(img, imgName);
  }
  if (imgName != undefined) {
    const imgUrl = await getImageUrl(imgName!);
    const stuff = { profile, profileImageUrl: imgUrl } as Stuff;
    await updateDocument(stuff, "stuffs", uid);
  }
  const stuff = { profile } as Stuff;
  await updateDocument(stuff, "stuffs", uid);

  setLoading(false);
  router.push(backPath);
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
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
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
    if (setLoading) {
      offLoadingAndBack(setLoading, router!, backPath!);
    }
  } catch (e) {
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
