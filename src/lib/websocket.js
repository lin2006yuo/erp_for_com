let webSend = WebSocket.prototype.send;

WebSocket.prototype.send = function (json) {
    if (this.IsOpen) {
        json = JSON.stringify(json);
        webSend.call(this, json);
    } else {
        this.waitSends.push(json);
    }
};


WebSocket.prototype.connected = function(){
    this.IsOpen = true;
    let json = null;
    while (json = this.waitSends.shift()){
        this.send(json);
    }
};

WebSocket.prototype.closed = function(){
    this.IsOpen = false;
};

WebSocket.prototype.sendCmd = function (cmd, data, callback=null) {
    let next = this.getNext();
    if(callback){
        this.callback[next] = callback;
    }
    this.send({cmd, data, type: 'cmd', next});
};

WebSocket.prototype.sendRequest = function(data, callback = null) {
    if(callback) {
        this.callback[data.id] = callback;
    }
    this.send(data);
};

WebSocket.prototype.subscibe = function (eventName, callback) {
    this.callback[eventName] = callback;
    this.send({type: 'subscibe', next: eventName});
};

WebSocket.prototype.unsubscibe = function (eventName, callback) {
    if (this.callback[eventName]) {
        this.callback[`${eventName}$$`] = callback;
        this.send({type: 'unsubscibe', next: eventName});
    } else {
        return false;
    }
};

WebSocket.prototype.unsubscibes = function(){
    Object.keys(this.callback).forEach(key=>{
        if(typeof key === 'string'){
            this.unsubscibe(key);
        }
    })
};

WebSocket.prototype.callback = {};
WebSocket.prototype.nextId = 0;
WebSocket.prototype.waitSends = [];
WebSocket.prototype.IsOpen = false;

WebSocket.prototype.getNext = function () {
    this.nextId += 1;
    return this.nextId;
};

WebSocket.prototype.reset = function () {
    this.nextId = 0;
    this.callback = {};
    this.waitSends = [];
};

WebSocket.prototype.responseMessage = function({data}) {
    data = JSON.parse(data);
    this.callback[data.id](data);
};

WebSocket.prototype.message = function ({data}) {
    data = JSON.parse(data);
    switch (data.type) {
        case 'cmd':
            this.callback[data.next](data.data);
            break;
        case 'subscibe':
            this.callback[data.next](data.data);
            break;
        case 'unsubscibe':
            delete this.callback[data.next];
            const uncallback = `${data.next}$$`;
            if(this.callback[uncallback] instanceof Function){
                this.callback[uncallback]();
            }
            delete this.callback[uncallback];
            break;
        case 'publish':
            this.callback[data.next](data.data);
            break;
        default:
            console.error(`wsmessage error`);
            console.log(data);

    }
};

export default WebSocket;