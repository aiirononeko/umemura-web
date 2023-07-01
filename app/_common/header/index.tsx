'use client';

import Link from 'next/link';
import { Layout, Menu } from 'antd';

export default function Header() {
  return (
    <Layout>
      <Layout.Header>
        <Menu
          theme="dark"
          mode="horizontal"
        >
          <Menu.Item key="1">
            <Link href="/">
              ホーム
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="signup">
              会員登録
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="signin">
              ログイン
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
    </Layout>
  )
}
