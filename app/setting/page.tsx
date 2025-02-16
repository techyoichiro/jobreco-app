'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { API_URL } from '@/const/const';

const storeMap: Record<number, string> = {
  1: '我家',
  2: 'Ate',
};

const AccountSettings: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [roleID, setRoleID] = useState(0);
  const [hourlyPay, setHourlyPay] = useState('');
  const [hourlyPayError, setHourlyPayError] = useState('');
  // competentID は文字列として管理。localStorage から取得した値がそのままセットされる
  const [competentID, setCompetentID] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || '';
    const storedRoleID = localStorage.getItem('roleID') || '0';
    const storedHourlyPay = localStorage.getItem('hourlyPay') || '';
    const storedCompetentID = localStorage.getItem('competentID') || '';

    setUserName(storedUserName);
    setRoleID(parseInt(storedRoleID, 10));
    setHourlyPay(storedHourlyPay);
    setCompetentID(storedCompetentID);
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (roleID === 2) {
      if (hourlyPay === '' || isNaN(Number(hourlyPay))) {
        setHourlyPayError('時給は数字を入力してください');
        return;
      }
    }
    setHourlyPayError('');

    try {
      const response = await axios.post(
        `${API_URL}/auth/update`,
        {
          employee_id: localStorage.getItem('empID'),
          user_name: userName,
          hourly_pay: hourlyPay,
          competent_id: competentID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('アカウントが正常に更新されました');
        localStorage.setItem('userName', userName);
        localStorage.setItem('hourlyPay', hourlyPay);
        localStorage.setItem('competentID', competentID);
      } else {
        alert('アカウント更新に失敗しました: ' + response.data.error);
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
          <CardTitle>アカウント設定</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleUpdateAccount}>
            {/* 名前 */}
            <div>
              <Label htmlFor="userName">名前</Label>
              <Input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            {/* 時給 */}
            <div>
              <Label htmlFor="hourlyPay">時給</Label>
              {roleID === 2 ? (
                <>
                  <Input
                    id="hourlyPay"
                    type="text"
                    value={hourlyPay}
                    onChange={(e) => setHourlyPay(e.target.value)}
                  />
                  {hourlyPayError && (
                    <div className="text-red-500 text-sm mt-1">{hourlyPayError}</div>
                  )}
                </>
              ) : (
                <div className="p-2 border rounded">{hourlyPay}</div>
              )}
            </div>
            {/* 主務店舗 */}
            <div>
              <Label htmlFor="competentID">主務店舗</Label>
              <Select value={competentID} onValueChange={setCompetentID}>
                <SelectTrigger id="competentID" className="w-full">
                  <SelectValue placeholder="店舗を選択" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(storeMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* 更新ボタン */}
            <div className="flex justify-end">
              <Button type="submit">更新</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => router.push('/setting/password')}>
            パスワード変更画面へ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSettings;
