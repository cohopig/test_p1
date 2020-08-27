//时间转换
export function formatTime(time) {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let day = 0;
  if (time) {
    seconds = time;
    if (seconds > 59) {
      minutes = Math.floor(seconds / 60)
      seconds = seconds % 60;
      if (minutes > 59) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60;
        if (hours > 23) {
          day = Math.floor(hours / 24)
          hours = hours % 60
        }
      }
    }
  }
  let ds = day > 9 ? day : `${day}天`;
  let hs = hours > 9 ? hours : `0${hours}`;
  let ms = minutes > 9 ? minutes : `0${minutes}`;
  let ss = seconds > 9 ? seconds : `0${seconds}`;
  console.log("2")
  return ds > 0 ? `${ds} ${hs}:${ms}:${ss}` : `${hs}:${ms}:${ss}`;
};
//倒计时
var t = ''
export function countDown(that) {
  var seconds = that.data.remainTime;
  if (seconds < 0) {
    that.setData({
      remainTime: 0,
      clock: formatTime(0),
      hideCommon: true,
      hideText: true,
      warm: true,
      flag03: true,
      flag30: true

    })
    console.log("4")

    return;
  }
  if (seconds === 0) {
    that.setData({
      remainTime: 0,
      clock: formatTime(0),
      hideCommon: true,
      hideText: true,
      flag30: true,
      flag03: true
    })
    console.log("3")

    return;
  }
  if (seconds <= 1620) {
    that.setData({
      flag03: true
    })
    console.log("flag03:true")
  }
  t = setTimeout(function() {
    that.setData({
      remainTime: seconds - 1,
      clock: formatTime(seconds - 1)
    });
    console.log("1")
    countDown(that);
  }, 1000);
};

//清除setTimeOut
export function clearTimeOut() {
  clearTimeout(t)
}
module.exports.clearTimeOut = clearTimeOut;