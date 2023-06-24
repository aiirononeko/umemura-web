'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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

function onCilick(setLoading: Dispatch<SetStateAction<boolean>>) {
  setLoading(true);
}

export default function MailAndPasswordForm(props: {buttonName: string}) {
  const [loading, setLoading] = useState(false);
  const { buttonName } = props;
  return (
    <>
      <Form.Item>
        <Input placeholder="メールアドレス" />
      </Form.Item>
      <Form.Item>
        <Input.Password placeholder="パスワード" />
      </Form.Item>
      <Form.Item className='flex justify-center'>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
          htmlType="submit"
          onClick={() => onCilick(setLoading)}
        >
          {buttonName}
        </Button>
      </Form.Item>
      {
        loading ? <Loding /> : <div />
      }
    </>
  );
}
