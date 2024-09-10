'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const statusMap: Record<number, string> = {
  0: '未出勤',
  1: '勤務中',
  2: '外出中',
  3: '退勤済み',
};

const storeMap: Record<number, string> = {
  1: '我家',
  2: 'Ate',
};

const AttendanceScreen: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('未出勤');
  const [location, setLocation] = useState('1');
  const [userName, setUserName] = useState<string | null>(null);
  const [statusID, setStatusID] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const userName = localStorage.getItem('userName');
    const storedStatusID = localStorage.getItem('statusID');

    setUserName(userName);

    if (storedStatusID) {
      const id = parseInt(storedStatusID, 10);
      setStatusID(id);
      setStatus(statusMap[id] || '未出勤');
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const handleStatusChange = async (Stamp: string) => {
    setErrorMessage(null);
    const storeID = parseInt(location, 10);
    try {
      const response = await axios.post(`http://localhost:8080/attendance/${Stamp}`, {
        employee_id: parseInt(localStorage.getItem('empID') || "0", 10),
        store_id: storeID,
      });

      if (response.status === 200) {
        const { data } = response;
        setStatusID(data.statusID);
        setStatus(statusMap[data.statusID] || '未出勤');
        localStorage.setItem('statusID', data.statusID.toString());
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error);
      }
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/summary/init');
      if (response.status === 200) {
        const employees = response.data;
        localStorage.setItem('employees', JSON.stringify(employees));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-green p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {userName ? `${userName}さん お疲れ様です！` : 'お疲れ様です！'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-600 text-white p-6 rounded-lg mb-4">
            <div className="text-4xl font-bold text-center mb-4">
              {formatTime(currentTime)}
            </div>
            {errorMessage && (
              <div className="text-xl font-bold text-center mb-4 text-red-600">
                {errorMessage}
              </div>
            )}
            <div className="flex items-center font-bold mb-2">
              <span>ステータス：{statusMap[statusID]}</span>
            </div>
            <div className="mt-2">
              <Label htmlFor="location" className="text-white">勤務場所</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" className="bg-white text-gray-700">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(storeMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleStatusChange('clockin')}
              variant="default"
              disabled={statusID !== 0}
            >
              出勤
            </Button>
            <Button
              onClick={() => handleStatusChange('clockout')}
              variant="default"
              disabled={statusID !== 1}
            >
              退勤
            </Button>
            <Button
              onClick={() => handleStatusChange('goout')}
              variant="default"
              disabled={statusID !== 1}
            >
              外出
            </Button>
            <Button
              onClick={() => handleStatusChange('return')}
              variant="default"
              disabled={statusID !== 2}
            >
              戻り
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            ログイン画面へ
          </Link>
          <Link href="/summary" className="text-blue-600 hover:text-blue-800 underline" onClick={fetchEmployees}>
            勤怠集計画面へ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AttendanceScreen;