"use client";

import { useState } from "react";
import { Form, Input } from "antd";
import MailAndPasswordForm from "../_components/mailAndPasswordForm";

export default function Login() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  return (
    <div className="container px-8 pt-2">
      <Form>
        <Form.Item>
          <Input
            placeholder="氏名"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="電話番号(ハイフンなし)"
            onChange={(e) => setPhoneNumber(Number(e.target.value))}
          />
        </Form.Item>
        <MailAndPasswordForm
          name={name}
          phoneNumber={phoneNumber}
          buttonValue="新規会員登録"
          isLogin={false}
        />
      </Form>
    </div>
  );
}
