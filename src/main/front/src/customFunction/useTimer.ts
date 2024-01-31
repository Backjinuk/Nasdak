import { useRef, useState } from 'react';

export function useTimer(duration: number, type: string) {
  const minutesInMilli = 60 * 1000;
  const secondsInMilli = 1000;
  let fullTime: number;
  if (type === '분' || type === 'min') {
    fullTime = duration * minutesInMilli;
  } else {
    fullTime = duration * secondsInMilli;
  }
  const [timeLimit, setTimeLimit] = useState(fullTime);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState('stop');
  const leftTime = Math.floor((timeLimit - time) / 1000);
  const timer = useRef<any>(null);

  function restart() {
    clearInterval(timer.current);
    setStatus('going');
    setTimeLimit(Date.now() + fullTime);
    setTime(Date.now());
    timer.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);
  }

  function stop() {
    clearInterval(timer.current);
    setStatus('stop');
  }

  if (leftTime < 0) {
    stop();
    setStatus('finished');
  }

  let viewTime;
  switch (status) {
    case 'stop':
      viewTime = '';
      break;
    case 'going':
      viewTime = ('0' + Math.floor(leftTime / 60)).slice(-2) + ':' + ('0' + (leftTime % 60)).slice(-2);
      break;
    case 'finished':
      viewTime = '시간초과';
      break;
  }

  return { restart, stop, viewTime };
}
