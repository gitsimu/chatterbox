import React from 'react';
import '../css/style.scss';

const Message = (props) => {
  const isMyself = props.info.id === props.userId;
  const isSameUser = (props.prev && (props.prev.userId === props.userId));

  const config = props.info.config;
  const nickname = config.nickname ? config.nickname: 'Opponent';
  // console.log('prev', props.prev);

  const skipDate = () => {
    if (!props.prev) return false;
    else {
      const prevDate = timestampToDay(props.prev.timestamp);
      const curDate = timestampToDay(props.timestamp);
      // console.log('skip', (prevDate === curDate) ? true : false);
      return (prevDate === curDate) ? true : false;
    }
  }

  return (
    <>
      { !skipDate() && (
        <div className="message-date"><span>{timestampToDay(props.timestamp)}</span></div>
      )}
      { !isSameUser && (
        <div className="margin-top-15"></div>
      )}
      { isMyself ? (
        <div className="message myself">
          <div className="message-time">
            { timestampToTime(props.timestamp, true) }
          </div>
          <div className="message-inner">
            { props.message }
          </div>
        </div>
      ) : (
        <div className="message opponent">
          <div className="message-profile">
            { !isSameUser && (
              <div className="message-profile-icon">{ nickname.substring(0, 1) }</div>
            )}
          </div>
          <div className="message-body">
            { !isSameUser && (
              <div className="message-top">
                <div className="message-name">{ nickname }</div>
              </div>
            )}
            <div className="message-bottom">
              <div className="message-inner">
                { props.message }
              </div>
              <div className="message-time">
                { timestampToTime(props.timestamp, true) }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function timestampToDay(timestamp) {
  const date = new Date(timestamp);
  let year = date.getFullYear(),
      month = date.getMonth()+1,
      day = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return year + '.' + month + '.' + day;
}

function timestampToTime(timestamp, isSimple) {
    const date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        week = new Array('일', '월', '화', '수', '목', '금', '토');

    const convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
    let convertHour = "";
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
