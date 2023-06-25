'use client';

import { useState } from 'react';
import { Form, Input } from 'antd';
import MailAndPasswordForm from '../components/mailAndPasswordForm';

export default function Login() {
  const [name, setName] = useState('');
  return (
    <div className='container px-8 pt-2'>
      <Form>
        <Form.Item>
          <Input
            placeholder="氏名"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <MailAndPasswordForm
          name={name}
          buttonValue='新規会員登録'
          isLogin={false}
        />
      </Form>
    </div>
  );
}
