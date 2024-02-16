import { AuthContext } from "@/context/AuthContext";
import { useStopwatch } from "@/customHooks/useStopwatch";
import { db } from "@/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";

export default function Test() {
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

  const saveTime = async () => {
    console.log(time);

    try {
      const today = "16-02-24";
      const subject = "Math";

      await updateDoc(doc(db, "users", user.uid), {
        [`${today}.${subject}`]: increment(time),
      });

      console.log("updated!!!!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center p-10">
      <div className="flex flex-col gap-2">
        <button className="btn" onClick={saveTime}>
          Save
        </button>
        <div className="flex justify-center items-center text-4xl tracking-widest font-bold">
          <span className="">{hours}:</span>
          <span className="">{minutes}:</span>
          <span className="">{seconds}</span>
        </div>

        <div>Time: {time}</div>

        <div>Is Running: {isRunning ? "Yes" : "No"}</div>
        <button onClick={start} disabled={isRunning}>
          Start
        </button>
        <button onClick={pause} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={reset}>Reset</button>
        <button
          onClick={() => {
            const { hours, minutes, seconds } = finish();
            console.log(
              `Study session finished. Time spent: ${hours} hours, ${minutes} minutes, ${seconds} seconds`
            );
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );
}
