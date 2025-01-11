'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_URL } from '@/const/const';

interface AttendanceRecord {
  ID: number;
  WorkDate: string;
  StartTime1: string;
  EndTime1: string;
  StartTime2: string | null;
  EndTime2: string | null;
  BreakStart: string | null;
  BreakEnd: string | null;
  StoreID1: number;
  StoreID2: number | null;
  Remarks: string;
  TotalWorkTime: number;
  Overtime: number;
  HourlyPay: number;
}

const storeMap: Record<number, string> = {
  1: '我家',
  2: 'Ate',
};

const EditRecords: React.FC = () => {
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecord = async () => {
      const attendanceID = localStorage.getItem('editAttendanceID');
      if (!attendanceID) {
        alert('No summary ID found');
        router.push('/summary');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/summary/edit/${attendanceID}`);
        setRecord(response.data.attendance);
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch record data');
      }
    };

    fetchRecord();
  }, [router]);

  if (!record) {
    return <div>Loading...</div>;
  }

  const handleSave = async () => {
    const isConfirmed = window.confirm('打刻を修正してもよろしいですか？');

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.post(`${API_URL}/summary/edit/${record.ID}`, record, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('打刻修正完了！');
      router.push('/summary');
    } catch (error) {
      console.error('Update error:', error);
      alert('修正に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto bg-custom-green">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">打刻修正</CardTitle>
        </CardHeader>
        <CardContent>
          {record.StartTime2 ? (
            <>
              {/* 1段目 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日付</TableHead>
                    <TableHead>店舗</TableHead>
                    <TableHead>勤務開始</TableHead>
                    <TableHead>勤務終了</TableHead>
                    <TableHead>休憩開始</TableHead>
                    <TableHead>休憩終了</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{record.WorkDate}</TableCell>
                    <TableCell>
                      <Select
                        value={String(record.StoreID1)}
                        onValueChange={(value) => {
                          setRecord({
                            ...record,
                            StoreID1: Number(value),
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="店舗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(storeMap).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.StartTime1}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            StartTime1: e.target.value,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.EndTime1}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            EndTime1: e.target.value,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.BreakStart || ''}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            BreakStart: e.target.value || null,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.BreakEnd || ''}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            BreakEnd: e.target.value || null,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* 2段目 */}
              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>店舗</TableHead>
                    <TableHead>勤務開始</TableHead>
                    <TableHead>勤務終了</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Select
                        value={record.StoreID2 ? String(record.StoreID2) : ''}
                        onValueChange={(value) => {
                          setRecord({
                            ...record,
                            StoreID2: value ? Number(value) : null,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="店舗を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(storeMap).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.StartTime2 || ''}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            StartTime2: e.target.value || null,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={record.EndTime2 || ''}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            EndTime2: e.target.value || null,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>店舗1</TableHead>
                  <TableHead>勤務開始1</TableHead>
                  <TableHead>勤務終了1</TableHead>
                  <TableHead>休憩開始</TableHead>
                  <TableHead>休憩終了</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{record.WorkDate}</TableCell>
                  <TableCell>
                    <Select
                      value={String(record.StoreID1)}
                      onValueChange={(value) => {
                        setRecord({
                          ...record,
                          StoreID1: Number(value),
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="店舗を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(storeMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.StartTime1}
                      onChange={(e) => {
                        setRecord({
                          ...record,
                          StartTime1: e.target.value,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.EndTime1}
                      onChange={(e) => {
                        setRecord({
                          ...record,
                          EndTime1: e.target.value,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.BreakStart || ''}
                      onChange={(e) => {
                        setRecord({
                          ...record,
                          BreakStart: e.target.value || null,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.BreakEnd || ''}
                        onChange={(e) => {
                          setRecord({
                            ...record,
                            BreakEnd: e.target.value || null,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              variant="default"
            >
              保存
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default EditRecords;
  