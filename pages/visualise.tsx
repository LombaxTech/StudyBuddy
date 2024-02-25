import {
  Card,
  DatePicker,
  DateRangePicker,
  LineChart,
  ProgressBar,
  Select,
  SelectItem,
} from "@tremor/react";
import React, { useContext, useEffect, useState } from "react";

import { BarChart } from "@tremor/react";
import { AuthContext } from "@/context/AuthContext";
import {
  formatDateToDayMonthYear,
  getKeyForDayMonthYear,
  getKeyForYesterday,
  getRandomColors,
  getSessionsBetweenDates,
  getSessionsLastSevenDays,
  getSessionsThisMonth,
} from "@/helperFunctions";
import { studySessions, sessions, colorNames } from "@/data";

export default function Visualise() {
  const { user } = useContext(AuthContext);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState<any>("Today");

  const [customDate, setCustomDate] = useState<any>(null);
  const [customDateRange, setCustomDateRange] = useState<any>(null);

  const [chartData, setChartData] = useState<any>(null);

  // const [subjects, setSubjects] = useState<any>(["Math", "Coding", "Y"]);
  const [subjects, setSubjects] = useState<any>([]);

  useEffect(() => {
    if (user) setSubjects(user?.subjects?.map((subject: any) => subject.name));
  }, [user]);

  const logStuff = () => {
    let r = getRandomColors(10, colorNames);

    console.log(r);
  };

  useEffect(() => {
    if (!user) return;

    if (selectedTime === "Today") {
      const today = getKeyForDayMonthYear();
      let todaysData = sessions.find((session) => session.date === today);
      let newChartData = [];
      for (const subject in todaysData?.subjects) {
        // @ts-ignore
        let minutes = todaysData.subjects[subject];
        newChartData.push({ subject, minutes });
      }

      setChartData(newChartData);
    } else if (selectedTime === "Yesterday") {
      const yesterday = getKeyForYesterday();
      let yesterdayData = sessions.find(
        (session) => session.date === yesterday
      );
      let newChartData = [];
      for (const subject in yesterdayData?.subjects) {
        // @ts-ignore
        let minutes = yesterdayData.subjects[subject];
        newChartData.push({ subject, minutes });
      }

      setChartData(newChartData);
    } else if (selectedTime === "This Week") {
      const lastSevenDaysData = getSessionsLastSevenDays(sessions);
      const aggregatedData: any[] = [];
      // let sessionSubjects: any = [];

      lastSevenDaysData.forEach((session) => {
        const [day, month, year] = session.date.split("-").map(Number);
        const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed
        const formattedDate = sessionDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Initialize an object to represent the data point for the session
        const dataPoint: any = {
          date: formattedDate,
        };

        // Iterate through each subject in the session
        for (const subjectName in session.subjects) {
          // if (!sessionSubjects.includes(subjectName)) {
          //   sessionSubjects.push(subjectName);
          // }
          const minutesStudied = session.subjects[subjectName];

          // Add the subject name and minutes studied to the data point
          dataPoint[subjectName] = minutesStudied;
        }

        // Push the data point to the aggregatedData array
        aggregatedData.push(dataPoint);
      });

      // setSubjects(sessionSubjects);
      setChartData(aggregatedData);
    } else if (selectedTime === "This Month") {
      const thisMonthData = getSessionsThisMonth(sessions);
      const aggregatedData: any[] = [];
      let sessionSubjects: any = [];

      thisMonthData.forEach((session) => {
        const [day, month, year] = session.date.split("-").map(Number);
        const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed
        const formattedDate = sessionDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Initialize an object to represent the data point for the session
        const dataPoint: any = {
          date: formattedDate,
        };

        // Iterate through each subject in the session
        for (const subjectName in session.subjects) {
          if (!sessionSubjects.includes(subjectName)) {
            sessionSubjects.push(subjectName);
          }
          const minutesStudied = session.subjects[subjectName];

          // Add the subject name and minutes studied to the data point
          dataPoint[subjectName] = minutesStudied;
        }

        // Push the data point to the aggregatedData array
        aggregatedData.push(dataPoint);
      });

      setSubjects(sessionSubjects);
      setChartData(aggregatedData);
    } else if (selectedTime === "Custom Range" && customDateRange) {
      if (!customDateRange?.from || !customDateRange?.to) return;

      const customSessions = getSessionsBetweenDates(
        sessions,
        customDateRange.from,
        customDateRange.to
      );

      const aggregatedData: any[] = [];
      let sessionSubjects: any = [];

      customSessions.forEach((session) => {
        const [day, month, year] = session.date.split("-").map(Number);
        const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed
        const formattedDate = sessionDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Initialize an object to represent the data point for the session
        const dataPoint: any = {
          date: formattedDate,
        };

        // Iterate through each subject in the session
        for (const subjectName in session.subjects) {
          if (!sessionSubjects.includes(subjectName)) {
            sessionSubjects.push(subjectName);
          }
          const minutesStudied = session.subjects[subjectName];

          // Add the subject name and minutes studied to the data point
          dataPoint[subjectName] = minutesStudied;
        }

        // Push the data point to the aggregatedData array
        aggregatedData.push(dataPoint);
      });

      setSubjects(sessionSubjects);
      setChartData(aggregatedData);
    } else if (selectedTime === "Custom Date" && customDate) {
      let customDay = formatDateToDayMonthYear(customDate);

      let customDaySession = sessions.find(
        (session) => session.date === customDay
      );
      let newChartData = [];
      for (const subject in customDaySession?.subjects) {
        // @ts-ignore
        let minutes = customDaySession.subjects[subject];
        newChartData.push({ subject, minutes });
      }
      setChartData(newChartData);
    } else {
      setChartData(null);
    }
  }, [selectedTime, selectedSubject, user, customDate, customDateRange]);

  if (user)
    return (
      <div className="flex-1 p-10 flex flex-col">
        <div className="flex flex-col gap-2 w-4/12">
          <h1 className="font-bold text-2xl">Visualise</h1>
          <button className="btn" onClick={logStuff}>
            Log stuff
          </button>

          {/* FILTER STUFF */}
          <div className="flex items-center gap-4">
            {/* Filter date */}

            <div className="flex items-center gap-2">
              <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Select date
              </label>
              <Select
                value={selectedTime}
                onValueChange={setSelectedTime}
                className="mt-2"
              >
                <SelectItem value={"Today"}>Today</SelectItem>
                <SelectItem value={"Yesterday"}>Yesterday</SelectItem>
                <SelectItem value={"This Week"}>This Week</SelectItem>
                <SelectItem value={"This Month"}>This Month</SelectItem>
                <SelectItem value={"Custom Date"}>Custom Date</SelectItem>
                <SelectItem value={"Custom Range"}>Custom Range</SelectItem>
              </Select>
            </div>

            {selectedTime === "Custom Date" && (
              <div className="flex items-center">
                <DatePicker
                  placeholder="Select custom date"
                  value={customDate}
                  onValueChange={setCustomDate}
                />
              </div>
            )}

            {selectedTime === "Custom Range" && (
              <div className="flex items-center">
                <DateRangePicker
                  placeholder="Select custom range"
                  enableSelect={false}
                  value={customDateRange}
                  onValueChange={setCustomDateRange}
                />
              </div>
            )}

            {/* Filter subject */}
            <div className="flex items-center gap-2">
              <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Select subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                className="mt-2"
              >
                <SelectItem value={"All"}>All</SelectItem>
                {user.subjects.map((subject: any) => {
                  return (
                    <SelectItem key={subject.name} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
        {/* GRAPH STUFF */}

        {/* BAR CHART FOR SINGLE DAYS */}
        {chartData &&
        (selectedTime === "Today" ||
          selectedTime === "Yesterday" ||
          (selectedTime === "Custom Date" && customDate)) ? (
          <BarChart
            data={chartData}
            index="subject"
            categories={["minutes"]}
            // colors={["blue", "red"]}
            colors={getRandomColors(subjects.length, colorNames)}
            // valueFormatter={dataFormatter}
            yAxisWidth={48}
            onValueChange={(v) => console.log(v)}
            className=""
          />
        ) : null}

        {/* LINE GRAPH FOR RANGES */}
        {chartData &&
        (selectedTime === "This Week" ||
          selectedTime === "This Month" ||
          (selectedTime === "Custom Range" && customDateRange)) ? (
          <LineChart
            className="h-80"
            data={chartData}
            index="date"
            categories={subjects}
            // colors={["indigo", "sky", "rose"]}
            colors={getRandomColors(subjects.length, colorNames)}
            valueFormatter={(n) => `${n} min`}
            yAxisWidth={60}
            onValueChange={(v) => console.log(v)}
          />
        ) : null}
      </div>
    );
}
