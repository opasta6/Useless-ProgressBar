import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Button, LinearProgress, Stack, TextField } from '@mui/material'

function App() {

  const RANDOM_THRESHOLD = 100;
  const GAME_TICK_INTERVAL_MS = 1000;

  const [progress, setProgress] = useState<number>(0);
  const [intervalID, setIntervalID] = useState<number | undefined>(undefined);
  const [rate, setRate] = useState<number>(5);
  const [max, setMax] = useState<number>(100);
  const [time, setTime] = useState<number>(GAME_TICK_INTERVAL_MS);
  const [executeFlag, setExecuteFlag] = useState<boolean>(false);

  // `endGame`関数は`intervalID`に依存しているため、`intervalID`が変更されたときのみ再生成されます。
  const endGame = useCallback(() => {
    if (intervalID !== undefined) {
      clearInterval(intervalID);
      setIntervalID(undefined);
    }
    setExecuteFlag(false);
  }, [intervalID]);

  // `incrementProgress`関数は`max`, `rate`, `endGame`に依存しているため、これらが変更されたときのみ再生成されます。
  const incrementProgress = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress >= max) {
        endGame(); // ここで`endGame`を呼び出してゲームを終了させます。
        return prevProgress; // 既に最大値に達しているため、現在の値をそのまま返します。
      } else if (Math.floor(Math.random() * RANDOM_THRESHOLD) < rate) {
        return 0;
      } else {
        return prevProgress + 1;
      }
    });
  }, [max, rate, endGame]);

  const startGame = useCallback(() => {
    if (intervalID === undefined) {
      setProgress(0);
      const newIntervalID = setInterval(incrementProgress, time);
      setIntervalID(newIntervalID);
      setExecuteFlag(true);
    }
  }, [intervalID, incrementProgress, time]);

  // ゲーム進行状況を監視し、`progress`が`max`を超えたら自動的にゲームを終了させます。
  useEffect(() => {
    if (progress >= max) {
      endGame();
    }
  }, [progress, max, endGame]);

  return (
    <>
      <h1>Useless Progressbar</h1>
      <h5>Really useless</h5>
      
      <br/>
      {(progress >= max) ? "congratulations!" : ""}

      <div>
        <LinearProgress variant="determinate" value={progress} color="secondary" sx={{ width: 500 }} />
        {progress}%
      </div>

      <div>
        <Button onClick={startGame} disabled={executeFlag} sx={{ border: 1, marginTop: 10, marginRight: 5, marginBottom: 10}} >
          Start
        </Button>

        <Button onClick={endGame} disabled={!executeFlag} sx={{ border: 1, marginTop: 10, marginLeft: 5, marginBottom: 10}} >
          End
        </Button>
      </div>

      <div>
        <Stack direction={'row'} spacing={2}>
          <label>rate</label>
          <TextField 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))} 
            sx={{ input: { color: 'white' } }} 
            variant="standard"
            disabled={executeFlag}
          />
        </Stack>
        <br/>
        <Stack direction={'row'} spacing={2}>
          <label>max</label>
          <TextField 
            type="number" 
            value={max} 
            onChange={(e) => setMax(Number(e.target.value))} 
            sx={{ input: { color: 'white' } }} 
            variant="standard"
            disabled={executeFlag}
          />
        </Stack>
        <br/>
        <Stack direction={'row'} spacing={2}>
          <label>time</label>
          <TextField 
            type="number" 
            value={time} 
            onChange={(e) => setTime(Number(e.target.value))}
            sx={{ input: { color: 'white' }}} 
            variant="standard"
            disabled={executeFlag}
          />
        </Stack>
      </div>
    </>
  )
}

export default App
