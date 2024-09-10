'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BreakRecord {
  ID: number;
  WorkDate: string;
  BreakStart: string;
  BreakEnd: string;
}

interface WorkSegment {
  ID: number;
  WorkDate: string;
  StoreID: number;
  StartTime: string;
  EndTime: string;
}

interface AttendanceRecord {
  workSegments: WorkSegment[];
  breakRecord: BreakRecord;
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
      const summaryID = localStorage.getItem('editSummaryID');
      if (!summaryID) {
        alert('No summary ID found');
        router.push('/summary');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/summary/edit/${summaryID}`);
        setRecord(response.data);
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
    try {
      await axios.post(`http://localhost:8080/summary/edit/${record.workSegments[0].ID}`, record, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Record updated successfully');
      router.push('/summary');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update record');
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto bg-custom-green">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">打刻修正</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>店舗</TableHead>
                <TableHead>勤務開始</TableHead>
                <TableHead>勤務終了</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.workSegments.map((segment) => (
                <TableRow key={segment.ID}>
                  <TableCell>{segment.WorkDate}</TableCell>
                  <TableCell>
                    <Select
                      value={String(segment.StoreID)}
                      onValueChange={(value) => {
                        const newSegments = [...record.workSegments];
                        const index = newSegments.findIndex(s => s.ID === segment.ID);
                        if (index > -1) {
                          newSegments[index].StoreID = Number(value);
                          setRecord({ ...record, workSegments: newSegments });
                        }
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
                      value={segment.StartTime}
                      onChange={(e) => {
                        const newSegments = [...record.workSegments];
                        const index = newSegments.findIndex(s => s.ID === segment.ID);
                        if (index > -1) {
                          newSegments[index].StartTime = e.target.value;
                          setRecord({ ...record, workSegments: newSegments });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={segment.EndTime}
                      onChange={(e) => {
                        const newSegments = [...record.workSegments];
                        const index = newSegments.findIndex(s => s.ID === segment.ID);
                        if (index > -1) {
                          newSegments[index].EndTime = e.target.value;
                          setRecord({ ...record, workSegments: newSegments });
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {record.breakRecord && (
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>休憩開始</TableHead>
                  <TableHead>休憩終了</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{record.breakRecord.WorkDate}</TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.breakRecord.BreakStart}
                      onChange={(e) => {
                        setRecord({
                          ...record,
                          breakRecord: {
                            ...record.breakRecord,
                            BreakStart: e.target.value,
                          }
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={record.breakRecord.BreakEnd}
                      onChange={(e) => {
                        setRecord({
                          ...record,
                          breakRecord: {
                            ...record.breakRecord,
                            BreakEnd: e.target.value,
                          }
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