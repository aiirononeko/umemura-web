'use client';

import { Form } from "antd";
import MailAndPasswordForm from '../layout';

export default function Login() {
  console.log('hoge');
  return (
    <div className='container px-8 pt-2'>
      <Form>
        <MailAndPasswordForm
          buttonName="ログイン"
        />
      </Form>
    </div>
  );
}
