'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('パスワードが一致していません');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://jobreco-api-njgi6c7muq-an.a.run.app/auth/signup',
        {
          name: name,
          login_id: email,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200) {
        router.push('/');
      } else {
        alert('サインアップに失敗しました: ' + response.data.error);
      }
    } catch (error: any) {
      console.error('エラーが発生しました:', error);
      if (error.response && error.response.data) {
        alert('エラーが発生しました: ' + error.response.data.error);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex">
            <ArrowLeft
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={() => router.back()}
            />
            <CardTitle className="items-center">サインアップ</CardTitle>
          </div>
          <CardDescription>フォームを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 flex flex-col items-center mt-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">氏名</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">ログインID</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">パスワード (確認用)</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button onSubmit={handleSignUp}>サインアップ</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
