"use server";

import nodemailer from "nodemailer";

export default async function sendMail(
  email: string,
  customerFirstName: string,
  customerLastName: string,
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
    ${customerLastName} ${customerFirstName}様
    ホリスティックサロン ルミージュです。
    この度はご予約いただき誠にありがとうございます。
    
    日時: ${reservationDate} ${reservationStartTime} ~ ${reservationEndTime}
    コース: ${course}
    お支払い予定額: ${amount}円

    当店の住所やアクセス、電話番号は公式サイトをご覧ください。
    https://holisticbeautysalon.dev

    それではお客様のご来店、心よりお待ちしております。
    `,
  });
}
