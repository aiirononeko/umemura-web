'use client';

import { Form, Input } from 'antd';
import MailAndPasswordForm from '../components/mailAndPasswordForm';

export default function Login() {
  return (
    <div className='container px-8 pt-2'>
      <Form>
        <Form.Item>
          <Input placeholder="氏名" />
        </Form.Item>
        <MailAndPasswordForm buttonName='新規会員登録' />
      </Form>
    </div>
  );
}
