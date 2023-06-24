'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { auth } from '../../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

interface Parameter {
  name: string;
  email: string;
  password: string;
  isLogin: boolean;
}

const SpinCss: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  backgroundColor: '#8888',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const Loding = () => {
  return (
    <div style={SpinCss}>
      <h1>Loding...</h1>
      <br />
      <Spin indicator={<LoadingOutlined />} spinning={true} />
    </div>
  );
}

function onCilick(setLoading: Dispatch<SetStateAction<boolean>>, parameter: Parameter, router: AppRouterInstance) {
  const { name, email, password, isLogin } = parameter;
  setLoading(true);

  if (isLogin) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('login');
        const user = userCredential.user;
        console.log(userCredential);
        router.push('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        window.alert('メールアドレスかパスワードが間違っています');
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    console.log('login');
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('success');
        const user = userCredential.user;
        console.log(user);
        router.push('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}

export default function MailAndPasswordForm(props: {name?: string, buttonValue: string, isLogin: boolean}) {
  const { buttonValue, isLogin, name } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [parameter, setParameter] = useState<Parameter>({
    name: name || '',
    email: '',
    password: '',
    isLogin: isLogin,
  });

  useEffect(() => {
    setParameter({ ...parameter, name: name || ''});
  }, [name])

  return (
    <>
      <Form.Item>
        <Input
          placeholder="メールアドレス"
          onChange={(e) => setParameter({ ...parameter, email: e.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <Input.Password
          placeholder="パスワード"
          onChange={(e) => setParameter({ ...parameter, password: e.target.value })}
        />
      </Form.Item>
      <Form.Item className='flex justify-center'>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
          htmlType="submit"
          onClick={() => onCilick(setLoading, parameter, router)}
        >
          {buttonValue}
        </Button>
      </Form.Item>
      {
        loading ? <Loding /> : <div />
      }
    </>
  );
}
