"use client";

import { auth } from "../config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";
import {
  type Stuff,
  addDocumentWithUid,
} from "@/app/firebase/service/collection";

/**
 * ユーザーのUIDを取得する.
 */
export function getUid() {
  return auth.currentUser?.uid;
}

/**
 * ログイン処理.
 */
export function authenticate(
  email: string,
  password: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string
) {
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then((_userCredential) => {
      window.alert("ログインしました");
      router.push(backPath);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      window.alert("メールアドレス、またはパスワードが違います");
    })
    .finally(() => {
      setLoading(false);
    });
}

/**
 * ユーザー登録処理.
 */
export function registerAuthenticate(
  collection: Stuff,
  collectionName: string,
  password: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string,
  onClose?: () => void
) {
  const { email } = collection;
  setLoading(true);
  createUserWithEmailAndPassword(auth, email!, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      const processedCollection = { ...collection, id: uid };
      addDocumentWithUid(processedCollection, collectionName, uid).then(() => {
        window.alert("登録が完了しました。");
        setLoading(false);
        router.push(backPath);
      });
    })
    .catch((_error) => {
      window.alert(`既にユーザーが存在します`);
    })
    .finally(() => {
      if (onClose) {
        onClose();
      }
      setLoading(false);
    });
}

export function registerStuffWithSendingEmail(
  data: Stuff,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  backPath: string
) {
  const parameter = `email=${data.email}&lastName=${data.lastName}&firstName=${data.firstName}&gender=${data.gender}`;
  const actionCodeSettings = {
    url: "https://www.holisticbeautysalon.dev?" + parameter,
    handleCodeInApp: true,
  };
  setLoading(true);
  const { email } = data;
  sendSignInLinkToEmail(auth, email!, actionCodeSettings)
    .then(() => {
      window.alert("スタッフにメールを送信しました");
      router.push(backPath);
    })
    .catch((error) => {
      console.log("error");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      window.alert(
        "メールを送信できませんでした(1日に送信できる上限を超えています)"
      );
    })
    .finally(() => {
      setLoading(false);
    });
}
