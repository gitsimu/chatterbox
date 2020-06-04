import React from 'react';
import '../css/style.scss';

const Message = (props) => {
  const isMyself = props.info.id === props.userId;
  const isSameUser = (props.prev && (props.prev.userId === props.userId));
  const config = props.info.config;
  const nickname = config.nickname ? config.nickname: 'Opponent';

  const skipDate = () => {
    if (!props.prev) return false;
    else {
      const prevDate = timestampToDay(props.prev.timestamp);
      const curDate = timestampToDay(props.timestamp);

      return (prevDate === curDate) ? true : false;
    }
  }

  let messageInner;
  if (props.type === 1) {
    messageInner = <div className="message-inner">{ props.message }</div>;
  }
  else {
    const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
    const extension = JSON.parse(props.message).location.split('.').pop();
    const expired = timestampToDay(props.timestamp, 1, 0);

    messageInner =
    <div>
      {( extension && images.indexOf(extension) > -1) && (
        <div className="message-thumbnail">
          <img src={ JSON.parse(props.message).location }/>
        </div>
      )}
      <div className="message-file">
        <div className="message-file-name">{ JSON.parse(props.message).name }</div>
        <div className="message-file-size">파일크기 : { bytesToSize(JSON.parse(props.message).size) }</div>
        <div className="message-file-expire">유효기간 : {expired} 까지</div>
        <div className="message-file-save">저장하기</div>
      </div>
    </div>
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
          <div className="message-time">{ timestampToTime(props.timestamp, true) }</div>
          { messageInner }
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
              <div className="message-inner">{ props.message }</div>
              <div className="message-time">{ timestampToTime(props.timestamp, true) }</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const timestampToDay = (timestamp, addMonth=0, addDays=0) => {
  const date = new Date(timestamp);
  let year = date.getFullYear(),
      month = date.getMonth()+1 + addMonth,
      day = date.getDate() + addDays;

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return year + '.' + month + '.' + day;
}

const timestampToTime = (timestamp, isSimple) => {
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

export default Message
