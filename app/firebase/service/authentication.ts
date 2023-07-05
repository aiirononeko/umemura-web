"use client";

import { auth } from "../config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";
import {
  type Customer,
  type Stuff,
  addDocumentWithUid,
} from "@/app/firebase/service/collection";

function setCurrentUser() {
  auth.onAuthStateChanged((user) => {
    console.log(user);
  });
}

export function getUid() {
  return auth.currentUser?.uid;
}

export function authenticate(
  email: string,
  password: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string
) {
  setLoading(true);
  console.log("called");
  signInWithEmailAndPassword(auth, email, password)
    .then((_userCredential) => {
      setCurrentUser();
      window.alert("ログインしました");
      router.push(backPath);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(`${errorCode}: ${errorMessage}`);
    })
    .finally(() => {
      setLoading(false);
    });
}

export function registerAuthenticate(
  collection: Customer,
  collectionName: string,
  password: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string,
  haveToSetUser: boolean
) {
  const { email } = collection;
  setLoading(true);
  console.log("called");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      addDocumentWithUid(collection, collectionName, uid);
      if (haveToSetUser) {
        setCurrentUser();
      }
      window.alert("登録が完了しました。");
      router.push(backPath);
    })
    .catch((_error) => {
      window.alert(`既にユーザーが存在します`);
    })
    .finally(() => {
      setLoading(false);
    });
}

export function registerStuffWithSendingEmail(
  data: Stuff,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string,
  haveToSetUser: boolean
) {
  const { email } = data;
  setLoading(true);
  console.log("called");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      addDocumentWithUid(data, "stuffs", uid);
      if (haveToSetUser) {
        setCurrentUser();
      }
      window.alert("登録が完了しました。");
      router.push(backPath);
    })
    .catch((_error) => {
      window.alert(`既にユーザーが存在します`);
    })
    .finally(() => {
      setLoading(false);
    });
}
