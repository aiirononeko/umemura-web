"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

interface Parameter {
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
  isLogin: boolean;
}

const SpinCss: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  backgroundColor: "#8888",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Loding = () => {
  return (
    <div style={SpinCss}>
      <h1>Loding...</h1>
      <br />
      <Spin indicator={<LoadingOutlined />} spinning={true} />
    </div>
  );
};

async function addCostomer(
  name: string,
  phoneNumber: number,
  email: string,
  password: string,
  uid: string
) {
  try {
    await setDoc(doc(db, "customers", uid), {
      name,
      phoneNumber,
      email,
      password,
    });
  } catch (error) {
    window.alert(error);
  }
}

function setCurrentUser() {
  auth.onAuthStateChanged((user) => {
    console.log(user);
  });
}

function onCilick(
  setLoading: Dispatch<SetStateAction<boolean>>,
  parameter: Parameter,
  router: AppRouterInstance
) {
  const { name, phoneNumber, email, password, isLogin } = parameter;
  setLoading(true);

  if (isLogin) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_userCredential) => {
        setCurrentUser();
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(`${errorCode}: ${errorMessage}`);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        addCostomer(name, phoneNumber, email, password, uid);
        setCurrentUser();
        window.alert("登録が完了しました。");
        router.push("/");
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
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [parameter, setParameter] = useState<Parameter>({
    name: "",
    phoneNumber:  0,
    email: "",
    password: "",
    isLogin: false,
  });

  return (
    <div className="container px-8 pt-2">
      <Form>
        <Form.Item>
          <Input
            placeholder="名前"
            onChange={(e) =>
              setParameter({ ...parameter, name: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="メールアドレス"
            onChange={(e) =>
              setParameter({ ...parameter, email: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="電話番号(半角・ハイフンなし)"
            onChange={(e) =>
              setParameter({ ...parameter, phoneNumber: Number(e.target.value) })
            }
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            placeholder="パスワード"
            onChange={(e) =>
              setParameter({ ...parameter, password: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item className="flex justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
            htmlType="submit"
            onClick={() => onCilick(setLoading, parameter, router)}
          >
            新規登録
          </Button>
        </Form.Item>
      </Form>
      {loading ? <Loding /> : <div />}
    </div>
  );
}
