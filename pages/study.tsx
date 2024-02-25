import { AuthContext } from "@/context/AuthContext";
import { useStopwatch } from "@/customHooks/useStopwatch";
import { db } from "@/firebase";
import { getKeyForDayMonthYear } from "@/helperFunctions";
import { doc, increment, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

export default function Study() {
  const { user } = useContext(AuthContext);

  const {
    time,
    isRunning,
    start,
    pause,
    reset,
    finish,
    seconds,
    minutes,
    hours,
  } = useStopwatch();

  const [selectedSubject, setSelectedSubject] = useState<any>("");
  const [error, setError] = useState<any>(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) setSelectedSubject(user.subjects[0].name);
  }, [user]);

  const startStudying = () => {
    setError(false);

    if (!selectedSubject) return setError("Please select a subject");

    console.log("started studying..." + selectedSubject);

    start();
  };

  const togglePause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const stopAndSave = async () => {
    if (time < 10) return;

    try {
      reset();

      const dayMonthYear = getKeyForDayMonthYear();

      await updateDoc(doc(db, "users", user.uid), {
        [`studySessions.${dayMonthYear}.${selectedSubject}`]: increment(time),
      });

      setSaveSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (user)
    return (
      <div className="flex flex-col p-10 items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">Start Studying!</h1>
          <div className="flex justify-center items-center text-4xl tracking-widest font-bold">
            <span className="">{hours}:</span>
            <span className="">{minutes}:</span>
            <span className="">{seconds}</span>
          </div>

          {time === 0 ? (
            <button
              className="btn"
              onClick={() => {
                setSaveSuccess(false);
                startStudying();
              }}
            >
              Start
            </button>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <button className="btn" onClick={togglePause}>
                {isRunning ? "Pause" : "Resume"}
              </button>
              <button className="btn" onClick={stopAndSave}>
                Finish
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-300 text-red-700 p-2 text-center">
              {error}
            </div>
          )}
          <h1 className="">Select Subject</h1>
          <select
            disabled={time !== 0}
            className="select w-full max-w-xs"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option disabled selected>
              Subject
            </option>
            {user.subjects.map((subject: any) => {
              return <option>{subject.name}</option>;
            })}
          </select>
        </div>
      </div>
    );
}
