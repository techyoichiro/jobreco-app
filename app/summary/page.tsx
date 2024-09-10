'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BreakRecordResponse {
  BreakStart: string;
  BreakEnd: string | null;
}

interface AttendanceRecord {
  ID: number;
  WorkDate: string;
  StartTime: string;
  EndTime: string | null;
  TotalWorkTime: number;
  BreakRecords: BreakRecordResponse[] | null;
  Overtime: number;
  Remarks: string;
  HourlyPay: number;
}

const AttendanceRecordList: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<{ value: string, label: string }[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [roleID, setRoleID] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    if (!selectedEmployee || !selectedYear || !selectedMonth) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/summary/${selectedEmployee}/${selectedYear}/${selectedMonth}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: AttendanceRecord[] | undefined = await response.json();

      if (!data) {
        throw new Error('No data received');
      }

      const formattedData = data.map(record => ({
        ID: record.ID,
        WorkDate: record.WorkDate,
        StartTime: record.StartTime,
        EndTime: record.EndTime ? record.EndTime : '-',
        TotalWorkTime: record.TotalWorkTime,
        BreakRecords: record.BreakRecords
          ? record.BreakRecords.map(breakRecord => ({
              BreakStart: breakRecord.BreakStart ? breakRecord.BreakStart : '-',
              BreakEnd: breakRecord.BreakEnd ? breakRecord.BreakEnd : '-',
            }))
          : [],
        Overtime: record.Overtime,
        Remarks: record.Remarks,
        HourlyPay: record.HourlyPay,
      }));

      setAttendanceRecords(formattedData);
      setIsSearched(true);

      // ローカルストレージの更新
      localStorage.setItem('selectedEmployee', selectedEmployee);
      localStorage.setItem('selectedYear', selectedYear);
      localStorage.setItem('selectedMonth', selectedMonth);
      localStorage.setItem('isSearched', 'true');
      localStorage.setItem('attendanceRecords', JSON.stringify(formattedData));
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, [selectedEmployee, selectedYear, selectedMonth]);

  useEffect(() => {
    if (initialLoad) {
      const now = new Date();
      const currentYear = now.getFullYear().toString();
      const currentMonth = (now.getMonth() + 1).toString();

      // ローカルストレージから値を取得（初回のみ）
      const storedEmployee = localStorage.getItem('selectedEmployee') || '';
      const storedYear = localStorage.getItem('selectedYear') || currentYear;
      const storedMonth = localStorage.getItem('selectedMonth') || currentMonth;
      const storedIsSearched = localStorage.getItem('isSearched') === 'true';
      const storedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');

      setSelectedEmployee(storedEmployee);
      setSelectedYear(storedYear);
      setSelectedMonth(storedMonth);
      setIsSearched(storedIsSearched);
      setAttendanceRecords(storedAttendanceRecords);

      // 役割ID取得と従業員情報の設定
      const storedRoleID = localStorage.getItem('roleID');
      if (storedRoleID) {
        const roleID = Number(storedRoleID);
        setRoleID(roleID);

        if (roleID === 2) {
          const storedEmployeeID = localStorage.getItem('empID');
          if (storedEmployeeID) {
            setSelectedEmployee(storedEmployeeID);
          }
        } else {
          const storedEmployees = localStorage.getItem('employees');
          if (storedEmployees) {
            const parsedEmployees = JSON.parse(storedEmployees);
            const formattedEmployees = parsedEmployees.map((employee: { id: number, name: string }) => ({
              value: employee.id.toString(),
              label: employee.name,
            }));
            setEmployees(formattedEmployees);
          }
        }
      }

      setInitialLoad(false);
    } else if (isSearched) {
      handleSearch();
    }
  }, [handleSearch, initialLoad, isSearched]);

  const handleDateClick = async (summaryID: number) => {
    try {
      const response = await fetch(`http://localhost:8080/summary/edit/${summaryID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch summary data');
      }
      localStorage.setItem('editSummaryID', summaryID.toString());
      
      router.push(`/summary/edit`);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const formatRemarks = (remarks: string) => {
    const storeMap: { [key: string]: string } = {
      '1': '我家',
      '2': 'Ate',
    };
  
    return remarks
      .split(', ')
      .map((remark) => {
        const [timeRange, storeID] = remark.split(' ');
        const storeName = storeMap[storeID] || storeID;
        return `${storeName}：${timeRange}`;
      })
      .join('\n');
  };

  const getTotalWorkTime = () => {
    return attendanceRecords.reduce((total, record) => total + record.TotalWorkTime, 0).toFixed(2);
  };

  const getTotalOvertime = () => {
    return attendanceRecords.reduce((total, record) => total + record.Overtime, 0).toFixed(2);
  };

  const getTotalFee = () => {
    const totalWorkTime = parseFloat(getTotalWorkTime());
    const totalOvertime = parseFloat(getTotalOvertime());
    const regularWorkTime = totalWorkTime - totalOvertime;
    const hourlyPay = attendanceRecords.length > 0 ? attendanceRecords[0].HourlyPay : 0;
    const regularPay = regularWorkTime * hourlyPay;
    const overtimePay = totalOvertime * hourlyPay * 1.25;
    const totalFee = parseInt((regularPay + overtimePay).toFixed(2))
    return `予定支給額：${totalFee}円`;
  };

  return (
    <div className="min-h-screen p-6 mx-auto bg-custom-green">
      <Card className="bg-custom-cream">
        <CardHeader>
          <CardTitle>勤怠記録一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            {roleID === 1 && (
              <Select onValueChange={(value) => setSelectedEmployee(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="従業員を選択" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.value} value={employee.value}>
                      {employee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select onValueChange={(value) => setSelectedYear(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="年を選択" />
              </SelectTrigger>
              <SelectContent>
                {['2023', '2024', '2025'].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSelectedMonth(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="月を選択" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {month}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="default">
              検索
            </Button>
          </div>

          {isSearched && attendanceRecords.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>開始時刻</TableHead>
                  <TableHead>休憩開始</TableHead>
                  <TableHead>休憩終了</TableHead>
                  <TableHead>終了時刻</TableHead>
                  <TableHead>勤務時間</TableHead>
                  <TableHead>時間外労働</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button variant="link" onClick={() => handleDateClick(record.ID)}>
                        {record.WorkDate}
                      </Button>
                    </TableCell>
                    <TableCell>{record.StartTime}</TableCell>
                    <TableCell>
                      {record.BreakRecords && record.BreakRecords.length > 0
                        ? record.BreakRecords.map((br, i) => (
                          <div key={i}>{br.BreakStart}</div>
                        ))
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.BreakRecords && record.BreakRecords.length > 0
                        ? record.BreakRecords.map((br, i) => (
                          <div key={i}>{br.BreakEnd}</div>
                        ))
                        : '-'}
                    </TableCell>
                    <TableCell>{record.EndTime}</TableCell>
                    <TableCell>{record.TotalWorkTime}</TableCell>
                    <TableCell>
                      {record.Overtime !== undefined && record.Overtime !== null && record.Overtime !== 0
                        ? record.Overtime.toFixed(2)
                        : '-'}
                    </TableCell>
                    <TableCell>{formatRemarks(record.Remarks)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>合計</TableCell>
                  <TableCell>{getTotalWorkTime()}</TableCell>
                  <TableCell>{getTotalOvertime()}</TableCell>
                  <TableCell>{getTotalFee()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          {isSearched && attendanceRecords.length === 0 && (
            <p className="text-center mt-4 text-gray-800">該当する勤怠記録がありません。</p>
          )}

          <div className="mt-4 text-left">
            <Link href="/attendance" className="text-blue-600 hover:text-blue-800 underline">
              打刻画面へ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceRecordList;