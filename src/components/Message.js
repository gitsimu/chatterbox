import React from 'react';
import '../css/style.scss';

const Message = (props) => {
  const messageClassName = 'message opponent'
  return (
    <div className={messageClassName}>
      <div className="message-inner">
        { props.message }
      </div>
      <div class="message-time">
        { timestampToTime(props.timestamp, true) }
      </div>
    </div>
  )
}

function timestampToTime(timestamp, isSimple) {
    var date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        week = new Array('일', '월', '화', '수', '목', '금', '토');

    var convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
    var convertHour="";
    if(hour < 12){
        convertHour = "오전 " + pad(hour) +":" + pad(minute);
    }else if(hour === 12){
        convertHour = "오후 " + pad(hour) +":" + pad(minute);
    }else{
        convertHour = "오후 " + pad(hour - 12) +":" + pad(minute);
    }

    return isSimple ? convertHour : convertDate + convertHour;
}

function pad(n) {
    return n > 9 ? "" + n: "0" + n;
}

export default Message
