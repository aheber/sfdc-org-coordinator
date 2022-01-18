export function msToTime(duration: number) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let hoursS = hours < 10 ? "0" + hours : hours;
  let minutesS = minutes < 10 ? "0" + minutes : minutes;
  let secondsS = seconds < 10 ? "0" + seconds : seconds;

  return hoursS + ":" + minutesS + ":" + secondsS;
}
