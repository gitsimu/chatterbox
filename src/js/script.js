export const setCookie = (cName, cValue, cDay) => {
  let expire = new Date();
  expire.setDate(expire.getDate() + cDay);
  let cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

export const getCookie = (cName) => {
  cName = cName + '=';
  let cookieData = document.cookie;
  let start = cookieData.indexOf(cName);
  let cValue = '';
  if(start != -1){
    start += cName.length;
    let end = cookieData.indexOf(';', start);
    if(end == -1)end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

export const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const timestampToDay = (timestamp, addMonth=0, addDays=0) => {
  const date = new Date(timestamp);
  let year = date.getFullYear(),
      month = date.getMonth()+1 + addMonth,
      day = date.getDate() + addDays;

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return year + '.' + month + '.' + day;
}

export const timestampToTime = (timestamp, isSimple) => {
  const date = new Date(timestamp),
      year = date.getFullYear(),
      month = date.getMonth()+1,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      week = new Array('일', '월', '화', '수', '목', '금', '토');

  const convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
  let convertHour = "";
  if (hour < 12) {
      convertHour = "오전 " + pad(hour) +":" + pad(minute);
  } else if(hour === 12){
      convertHour = "오후 " + pad(hour) +":" + pad(minute);
  } else{
      convertHour = "오후 " + pad(hour - 12) +":" + pad(minute);
  }

  return isSimple ? convertHour : convertDate + convertHour;
}

const pad = (n) => {
  return n > 9 ? "" + n: "0" + n;
}

export const checkWorkingTime = (w) => { 
  const week = ["su", "mo", "tu", "we", "th", "fr", "sa"]
  const today = new Date()
  const now = parseInt(`${today.getHours()}${today.getMinutes()}`, 10)

  let isValidWeek = true
  let isValidHour = true 
  let isValidBreak = true

  // week
  isValidWeek = w.week.includes(week[today.getDay()])

  // time
  if (!w.allday) {
    isValidHour = checkValidHours(w.startWork, w.endWork, now)
  }

  // break
  if (w.breaktime) {
    isValidBreak = !checkValidHours(w.startBreak, w.endBreak, now)
  }

  console.log('week, hour, break', isValidWeek, isValidHour, isValidBreak )
  return (isValidWeek && isValidHour && isValidBreak)
}

const checkValidHours = (start, end, now) => {
  const s = parseInt(start, 10)
  const e = parseInt(end, 10)
  const n = parseInt(now, 10)

  if (s <= e) {
    return s <= n && n <= e
  } else {
    return !(e < n && n < s)
  }
}