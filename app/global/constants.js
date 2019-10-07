// export const API = 'https://crawlr-api.herokuapp.com';
export const API = 'http://hani.local:3000';

export function getTimeSince(t) {
  var timeStamp = new Date(t);
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + 's ago';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + 'm ago';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + 'h ago';
  }
  if (secondsPast > 86400) {
    day = timeStamp.getDate();
    month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(' ', '');
    year =
      timeStamp.getFullYear() == now.getFullYear()
        ? ''
        : ' ' + timeStamp.getFullYear();
    return day + ' ' + month + year;
  }
}
