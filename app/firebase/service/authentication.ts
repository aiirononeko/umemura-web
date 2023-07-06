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
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000?email=' + data.email,
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // dynamicLinkDomain: 'example.page.link'
  };
  console.log(actionCodeSettings)
  setLoading(true);
  const { email } = data;
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      console.log('success');
      window.localStorage.setItem('emailForSignIn', email);
      // ...
    })
    .catch((error) => {
      console.log('error');
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    })
    .finally(() => {
      setLoading(false);
    });
  // const { email } = data;
  // setLoading(true);
  // console.log("called");
  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     const user = userCredential.user;
  //     const uid = user.uid;
  //     addDocumentWithUid(data, "stuffs", uid);
  //     if (haveToSetUser) {
  //       setCurrentUser();
  //     }
  //     window.alert("登録が完了しました。");
  //     router.push(backPath);
  //   })
  //   .catch((_error) => {
  //     window.alert(`既にユーザーが存在します`);
  //   })
  //   .finally(() => {
  //     setLoading(false);
  //   });
}
