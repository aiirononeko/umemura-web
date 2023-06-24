'use client';

import { Form } from "antd";
import MailAndPasswordForm from '../components/mailAndPasswordForm';

export default function Login() {
  return (
    <div className='container px-8 pt-2'>
      <Form>
        <MailAndPasswordForm
          buttonValue="ログイン"
          isLogin={true}
        />
      </Form>
    </div>
  );
}
