Date.prototype.getSTime = function (){
    return Math.floor(this.getTime() / 1000)
};

Date.prototype.getStartDaySTime = function (){
    let temp = new Date(this.getTime());
    temp.setHours(0);
    temp.setMinutes(0);
    temp.setSeconds(0);
    return temp.getSTime();
};

Date.prototype.getEndDaySTime = function (){
    return this.getStartDaySTime() + 86400;
};

Date.prototype.format = function(format = 'yyyy-mm-dd hh:mm:ss'){
    return `${this.getFullYear()}-${this.getMonth()+1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`;
};
