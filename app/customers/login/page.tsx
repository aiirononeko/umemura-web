'use client';

import { Form } from "antd";
import MailAndPasswordForm from '../mailAndPasswordForm';

export default function Login() {
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
