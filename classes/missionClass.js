module.exports = class Mission {
  constructor(missionType, location, expiration) {
    this.location = location;
    this.missionType = missionType;
    this.expiration = expiration;
  }
  getTimeLeft(exp) {
    let timeInMilliseconds = [
      [86400000, "d"],
      [3600000, "h"],
      [60000, "m"],
      [1000, "s"]
    ];
    let timeConversions = [1000, 60, 60, 24, 35];
    let timeString = "";
    let time = exp - new Date();

    timeInMilliseconds.forEach(function(milliArray, i) {
      let dummy = 0;
      if (time >= milliArray[0]) {
        dummy = time;
        timeConversions.forEach(function(dividend, i, oriArr) {
          if (i < oriArr.length - 1) {
            dummy /= dividend;
          } else {
            dummy %= dividend;
          }
        });
        if (dummy > 0) {
          timeString += `${Math.floor(dummy)}${milliArray[1]} `;
        }
      }
      timeConversions.splice(-1, 1);
    });
    if (timeString.length) {
      return timeString.trim();
    } else return "0s";
  }

  numberWithCommas(num) {
    //3000 --> 3,000
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
