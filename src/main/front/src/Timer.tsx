import { useEffect, useRef, useState } from 'react';

export default function Timer({
  onTimer,
  setViewTime,
  setOnTimer,
  duration,
  type,
}: {
  onTimer: number;
  setViewTime: any;
  setOnTimer: any;
  duration: number;
  type: string;
}) {
  const minutesInMilli = 60 * 1000;
  const secondsInMilli = 1000;
  let fullTime: number;
  if (type === '분') {
    fullTime = duration * minutesInMilli;
  } else {
    fullTime = duration * secondsInMilli;
  }
  const [timeLimit, setTimeLimit] = useState(fullTime);
  const [time, setTime] = useState(0);
  const leftTime = Math.floor((timeLimit - time) / 1000);
  const viewTime = ('0' + Math.floor(leftTime / 60)).slice(-2) + ':' + ('0' + (leftTime % 60)).slice(-2);
  const timer = useRef<any>(null);

  useEffect(() => {
    clearInterval(timer.current);
    if (onTimer) {
      setTimeLimit(Date.now() + fullTime);
      setTime(Date.now());
      timer.current = setInterval(() => {
        setTime(Date.now());
      }, 1000);
    } else {
      setViewTime('');
    }
  }, [onTimer, fullTime, setViewTime]);

  if (time > 0) {
    setViewTime(viewTime);
    if (leftTime < 0) {
      setOnTimer(false);
      setViewTime('시간초과');
    }
  }

  return <></>;
}
