'use client';

import { auth } from "../firebase/config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";
import { type Customer, type Stuff, addCollectionWithUid } from "./collection";

function setCurrentUser() {
  auth.onAuthStateChanged((user) => {
    console.log(user);
  });
}

export function authenticate(email: string, password: string, setLoading: Dispatch<SetStateAction<boolean>>, router: AppRouterInstance, backPath: string) {

  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then((_userCredential) => {
      setCurrentUser();
      window.alert("ログインしました");
      router.push(backPath);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(`${errorCode}: ${errorMessage}`);
    })
    .finally(() => {
      setLoading(false);
    });
}

export function registerAuthenticate(collection: Customer | Stuff, collectionName: string, setLoading: Dispatch<SetStateAction<boolean>>, router: AppRouterInstance, backPath: string, haveToSetUser: boolean) {
  const { email, password } = collection;
  setLoading(true);
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      const uid = user.uid;
      addCollectionWithUid(collection, collectionName, uid);
      if (haveToSetUser) {
        setCurrentUser();
      }
      window.alert("登録が完了しました。");
      router.push(backPath);
    })
    .catch(_error => {
      window.alert(`既にユーザーが存在します`);
    })
    .finally(() => {
      setLoading(false);
    });
}
