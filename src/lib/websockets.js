window.local_websocket = null;
window.whole_websocket = null;

class LocalWebSocket {
    constructor(option) {
        this.pingTimeoutId = null;
        this.pongTimeoutId = null;
        if (!local_websocket || !local_websocket.IsOpen) {
            try {
                window.local_websocket = new WebSocket('ws://127.0.0.1:10091/websocket');
            } catch (e) {
                console.info('wss: ', e);
            }
        }
        /*local_websocket.onopen = !!option.open ? option.open : () => {
            local_websocket.connected();
        };*/
        local_websocket.onopen = () => {
            !!option.open ? option.open() :
                local_websocket.connected();
        }
        /*local_websocket.onmessage = !!option.message ? option.message : (data) => {
            local_websocket.responseMessage(data);
        };*/
        local_websocket.onmessage = (data) => {
            this.heartCheck();
            if(JSON.parse(data.data).message === 'route参数有误') {
                return;
            }
            !!option.message ? option.message(data) : local_websocket.responseMessage(data);
        }

        local_websocket.onerror = !!option.error ? option.error : () => {
            local_websocket.closed();
        };

        local_websocket.onclose = () => {
            local_websocket.closed();
        }
    }

    send(data, callback = null) {
        local_websocket.sendRequest(data, callback);
    }

    heartCheck() {
        this.heartReset();
        this.heartStart();
    }

    heartReset() {
        clearTimeout(this.pingTimeoutId);
        clearTimeout(this.pongTimeoutId);
    }

    heartStart() {
        this.pingTimeoutId = setTimeout(() => {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            this.send({});
            //如果超过一定时间还没重置，说明后端主动断开了
            this.pongTimeoutId = setTimeout(() => {
                //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                local_websocket.close();
            }, 3000);
        }, 3000);
    }
}

class WholeWebSocket {
    constructor(option) {
        if (!whole_websocket || !whole_websocket.IsOpen) {
            window.whole_websocket = new WebSocket('ws://127.0.0.1:7005');
        }
        whole_websocket.onopen = !!option.open ? option.open : () => {
            whole_websocket.connected();
        };

        whole_websocket.onmessage = !!option.message ? option.message : (data) => {
            whole_websocket.responseMessage(data);
        };

        whole_websocket.onerror = !!option.error ? option.error : () => {
            whole_websocket.closed();
        };
        whole_websocket.onclose = () => {
            whole_websocket.closed();
        };
    }

    send(data, callback = null) {
        whole_websocket.sendRequest(data, callback);
    }
}

window.localWebSocket = (option) => {
    let localWebSocket = new LocalWebSocket(option);
    return localWebSocket;
};

window.wholeWebSocket = (option) => {
    let wholeWebSocket = new WholeWebSocket(option);
    return wholeWebSocket;
};