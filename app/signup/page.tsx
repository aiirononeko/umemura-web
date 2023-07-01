"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Loader, TextInput, Button, Container, Center } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Parameter {
  name: string;
  phoneNumber: string;
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
      <Loader size='xl' />
    </div>
  );
};

async function addCostomer(
  name: string,
  phoneNumber: string,
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

function registerUser(
  setLoading: Dispatch<SetStateAction<boolean>>,
  parameter: Parameter,
  router: AppRouterInstance
) {
  const { name, phoneNumber, email, password } = parameter;
  setLoading(true);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      addCostomer(name, phoneNumber, email, password, uid);
      setCurrentUser();
      window.alert("登録が完了しました。");
      router.push("/");
    })
    .catch((_error) => {
      window.alert(`既にユーザーが存在します`);
    })
    .finally(() => {
      setLoading(false);
    });
}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      phoneNumber:  "",
      email: "",
      password: "",
    } as Parameter,
    validate: {
      'name': value => value.length < 1 ? '名前を入力してください' : null,
      'email': value => (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).test(value) ?  null : 'メールアドレスを正しく入力してください',
      'phoneNumber': value => (/^0[789]0-[0-9]{4}-[0-9]{4}$/).test(value) ?  null : '電話番号はxxx-yyyy-zzzzのフォーマットで入力してください',
      'password': value => value.length < 6 ? 'パスワードは6文字以上で入力してください' : null,
    }
  });

  return (
    <Container className='m-auto'>
      <form
        onSubmit={form.onSubmit(values => { registerUser(setLoading, values, router) })}
      >
        <TextInput
          label="名前"
          placeholder="テスト太郎"
          required
          {...form.getInputProps('name')}
          mb='lg'
        />
        <TextInput
          label="メールアドレス"
          placeholder="testtaro@example.com"
          required
            {...form.getInputProps('email')}
          mb='lg'
        />
        <TextInput
          label="電話番号"
          placeholder="000-1111-2222"
          required
          {...form.getInputProps('phoneNumber')}
          mb='lg'
        />
        <TextInput
          label="パスワード"
          placeholder="パスワード"
          required
          type="password"
          {...form.getInputProps('password')}
        />
        <div className='pt-4'>
          <Center>
            <Button
              type="submit"
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold'
            >
              新規登録
            </Button>
          </Center>
        </div>
      </form>
      {loading ? <Loding /> : <></>}
    </Container>
  );
}
