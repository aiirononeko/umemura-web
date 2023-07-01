"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

interface Parameter {
  email: string;
  password: string;
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
  const { email, password } = parameter;
  setLoading(true);

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
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [parameter, setParameter] = useState<Parameter>({
    email: "",
    password: "",
  });

  return (
    <div className="container px-8 pt-2">
      <Form>
        <Form.Item>
          <Input
            placeholder="メールアドレス"
            onChange={(e) =>
              setParameter({ ...parameter, email: e.target.value })
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
