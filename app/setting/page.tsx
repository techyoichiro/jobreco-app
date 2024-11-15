'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert('新しいパスワードが一致していません');
      return;
    }

    try {
      const response = await axios.post(
        'https://jobreco-api-njgi6c7muq-an.a.run.app/auth/change-password',
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('パスワードが正常に変更されました');
        router.push('/'); // パスワード変更後にリダイレクトするページ
      } else {
        alert('パスワード変更に失敗しました: ' + response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('エラーが発生しました:', error);
        if (error.response && error.response.data) {
          alert('エラーが発生しました: ' + error.response.data.error);
        } else {
          alert('エラーが発生しました');
        }
      } else {
        console.error('予期しないエラーが発生しました:', error);
        alert('予期しないエラーが発生しました');
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
            <CardTitle className="items-center">パスワード変更</CardTitle>
          </div>
          <CardDescription>新しいパスワードを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 flex flex-col items-center mt-4" onSubmit={handleChangePassword}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currentPassword">現在のパスワード</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="newPassword">新しいパスワード</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmNewPassword">新しいパスワード (確認用)</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit">パスワードを変更する</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
