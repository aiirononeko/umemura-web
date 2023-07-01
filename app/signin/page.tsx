"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Loader, TextInput, Button, Container, Center } from '@mantine/core';
import { useForm } from '@mantine/form';

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
      <Loader size='xl' />
    </div>
  );
};

function setCurrentUser() {
  auth.onAuthStateChanged((user) => {
    console.log(user);
  });
}

function checkUser(
  setLoading: Dispatch<SetStateAction<boolean>>,
  parameter: Parameter,
  router: AppRouterInstance
) {
  const { email, password } = parameter;
  setLoading(true);

  signInWithEmailAndPassword(auth, email, password)
    .then((_userCredential) => {
      console.log('login');
      setCurrentUser();
      window.alert("ログインしました");
      router.push("/");
    })
    .catch((error) => {
      console.log('エラー')
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
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    } as Parameter,
    validate: {
      'email': value => (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).test(value) ?  null : 'メールアドレスを正しく入力してください',
      'password': value => value.length < 6 ? 'パスワードは6文字以上で入力してください' : null,
    },
  });

  return (
    <>
      <Container className='m-16'>
        <form
          onSubmit={form.onSubmit(values => { checkUser(setLoading, values, router) })}
        >
          <TextInput
            label="メールアドレス"
            placeholder="メールアドレス"
            required
            {...form.getInputProps('email')}
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
                ログイン
              </Button>
            </Center>
          </div>
        </form>
        {loading ? <Loding /> : <></>}
      </Container>
    </>
  );
}
