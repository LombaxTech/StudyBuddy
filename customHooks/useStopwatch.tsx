import React, { useState, useEffect } from "react";

function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: any;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const finish = () => {
    setIsRunning(false);
    setTime(0);
    return {
      hours: Math.floor(time / 3600),
      minutes: Math.floor((time % 3600) / 60),
      seconds: time % 60,
    };
  };

  // Helper function to format time component with leading zeros
  const formatTimeComponent = (timeComponent: any) => {
    return timeComponent.toString().padStart(2, "0");
  };

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    finish,
    seconds: formatTimeComponent(time % 60),
    minutes: formatTimeComponent(Math.floor((time % 3600) / 60)),
    hours: formatTimeComponent(Math.floor(time / 3600)),
  };
}

function Stopwatch() {
  const { time, isRunning, start, pause, reset, finish } = useStopwatch();

  const formatTimeComponent = (timeComponent: any) => {
    return timeComponent.toString().padStart(2, "0");
  };

  const formatTime = () => {
    const hours = formatTimeComponent(Math.floor(time / 3600));
    const minutes = formatTimeComponent(Math.floor((time % 3600) / 60));
    const seconds = formatTimeComponent(time % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <div>{formatTime()}</div>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={pause} disabled={!isRunning}>
        Pause
      </button>
      <button onClick={reset}>Reset</button>
      <button onClick={finish}>Finish</button>
    </div>
  );
}

export { useStopwatch, Stopwatch };
