'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Employee {
  id: number;
  name: string;
}

export const Login: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://jobreco-api-njgi6c7muq-an.a.run.app/summary/init');
        if (response.status === 200) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error('従業員リストの取得に失敗しました:', error);
        setError('従業員リストの取得に失敗しました。');
      }
    };
    fetchEmployees();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployeeID) {
      setError('従業員を選択してください。');
      return;
    }

    try {
      const response = await axios.post('https://jobreco-api-njgi6c7muq-an.a.run.app/auth/login', {
        id: selectedEmployeeID,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.setItem('empID', response.data.employee.ID.toString());
        localStorage.setItem('userName', response.data.employee.Name);
        localStorage.setItem('statusID', response.data.status_id.toString());
        localStorage.setItem('roleID', response.data.employee.RoleID.toString());
        router.push('/attendance');
      } else {
        setError('ログインに失敗しました。入力情報を確認してください。');
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('ログインエラー:', error.message);
          setError('ログインに失敗しました。入力情報を確認してください。');
        } else {
          console.error('予期しないエラー:', error);
          setError('ログインに失敗しました。入力情報を確認してください。');
        }
      }
  };

  return (
    <div>
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>ログイン</CardTitle>
                <CardDescription>名前を選択しパスワードを入力してください</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">名前</Label>
                            <Select onValueChange={(value) => setSelectedEmployeeID(value)}>
                                <SelectTrigger id="name">
                                <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => { setSelectedEmployeeID(null); setPassword(''); }}>
                クリア
                </Button>
                <Button onClick={handleLogin}>ログイン</Button>
            </CardFooter>
        </Card>
        <p className="mt-4 text-center text-sm text-white">
        アカウントをお持ちでないですか？{' '}
        <Link href="/signup" className="text-yellow-500 hover:text-blue-500 underline">
            サインアップ
        </Link>
        </p>
    </div>
  );
}
