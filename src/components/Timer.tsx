interface TimerProperties {
  counter: number;
}

function Timer({ counter }: TimerProperties) {
  return <div>{counter}</div>;
}

export default Timer;
