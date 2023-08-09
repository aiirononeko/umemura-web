"use server";

import nodemailer from "nodemailer";

export default async function sendMailToStuff(
  email: string,
  customerName: string,
  reservationDate: string,
  reservationStartTime: string,
  reservationEndTime: string,
  course: string,
  amount: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_MAIL_USER,
      pass: process.env.NEXT_PUBLIC_MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_MAIL_USER,
    to: email,
    subject: "以下の内容でご予約を受け付けました",
    text: `
    予約が入りました！
    管理アプリから確認をお願いします。

    お客様氏名: ${customerName}
    日時: ${reservationDate} ${reservationStartTime} ~ ${reservationEndTime}
    コース: ${course}
    お支払い予定額: ${amount}円
        `,
  });
}
