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
  // const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const date = new Date(timestamp);
  let year = date.getFullYear(),
      month = date.getMonth()+1 + addMonth,
      day = date.getDate() + addDays;
      //weekday = weekdays[date.getDay()]

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return `${year}.${month}.${day}`;
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
  if (!w || !w.use) {
    return true
  }

  const week = ["su", "mo", "tu", "we", "th", "fr", "sa"]
  const today = new Date()
  const hour = today.getHours()
  const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()
  const now = parseInt(`${hour}${minutes}`, 10)

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

  // console.log('week, hour, break', isValidWeek, isValidHour, isValidBreak )
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

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const mobileCheck = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

export const guestCodeGenerator = (uid) => {
  const name1 = ['다홍', '주황', '노랑', '연두', '초록', '백록', '진초록', '청죽', '청록', '연청', '하늘', '벽청', '분홍', '자주', '연보라', '남보라'];
  const name2 = ['쿠키', '파스타', '파이', '치즈', '어니언', '요거트', '크림', '애플', '바나나', '망고', '키위', '라임', '민트', '초콜릿', '코코넛', '케이크', '머랭', '버터', '아이스티', '커피', '마카롱', '마들렌', '감자', '엉겅퀴', '갈릭', '카모마일', '에이드', '샐러드', '크루아상', '타르트', '에일', '라거', '와인', '오렌지', '딸기', '자두', '복숭아', '호박', '자몽', '살구', '해바라기', '자동차', '비행기', '자전거', '창문', '튤립', '수선화', '장미', '안개', '야자수', '선인장', '단풍', '안경', '나무', '유리', '튜브', '액자', '양초', '보드', '네온', '필름', '달팽이', '오두막', '퍼퓸'];
  const color1 = ['#fbafaf', '#ffbc98', '#ffd993', '#ebef96', '#b8d579', '#d0e4c8', '#a9d19f', '#9debe3', '#81d7e6', '#9de2fb', '#71daf4', '#9fc9f1', '#f5d1e7', '#d8acce', '#d8c2eb', '#aaa1da'];

  const uid32 = parseInt(uid, 16).toString(32);
  const code1 = parseInt(uid.slice(uid.length - 2, uid.length - 1), 32); // 16
  const code2 = parseInt(uid32.slice(uid32.length - 3, uid32.length - 2), 32); // 32
  const code3 = parseInt(uid32.slice(uid32.length - 4, uid32.length - 3), 32); // 32
  const code4 = parseInt(uid.slice(0, 2), 32);

  const obj = {};
  if (name1[code1] && name2[code2 + code3]) {
    obj.guestCode = name1[code1] + ' ' + name2[code2 + code3] + ' ' + code4;
    obj.colorCode = color1[code1];
  }
  else {
    obj.guestCode = '알수없는 사용자';
    obj.colorCode = '#00aaff';
  }
  return obj;
}

export const getWorkingSchedule = (workingTime) => {
  const WEEK_DIC = {
    'mo': '월',
    'tu': '화',
    'we': '수',
    'th': '목',
    'fr': '금',
    'sa': '토',
    'su': '일'
  }

  const workingDate = () => {
    const {week} = workingTime
    if(week.length === 7) return "매일"

    const workingWeek = Object.keys(WEEK_DIC).map(w => workingTime.week.indexOf(w) > -1 ? WEEK_DIC[w] : 'X')
    const workingPart = workingWeek.join('').split('X').filter(t=> t)

    const tostr = (w) => w.length > 1
        ? `${w[0]}~${w[w.length - 1]}`
        : `${w[0]}`


    if(workingPart.length === 1) {
      return tostr(workingPart[0])
    }
    if(workingPart.length === 2) {
      return `${tostr(workingPart[0])},${tostr(workingPart[1])}`
    }

    return workingPart.join('').split('').join(',')
  }
  const workingTimeStr = ()=>{
    const {allday, startWork, endWork} = workingTime

    if(allday) return '00:00 ~ 24:00'
    return `${timestampToTime(new Date(0,0,0,startWork.slice(0,2),startWork.slice(2)), true)} ~ ${timestampToTime(new Date(0,0,0,endWork.slice(0,2),endWork.slice(2)), true)}`
  }

  const workingStr = () => {
    return `${workingDate()} : ${workingTimeStr()}`
  }

  const breakStr = () => {
    const {breaktime, startBreak, endBreak} = workingTime

    if(!breaktime) return ''

    return `\n점심시간 : ${timestampToTime(new Date(0,0,0,startBreak.slice(0,2),startBreak.slice(2)), true)} ~ ${timestampToTime(new Date(0,0,0,endBreak.slice(0,2),endBreak.slice(2)), true)}`
  }

  return `현재 상담시간이 아닙니다.\n\n상담 운영시간\n${workingStr()}${breakStr()}`
}