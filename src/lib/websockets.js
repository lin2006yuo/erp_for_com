window.local_websocket = null;
window.whole_websocket = null;

class LocalWebSocket {
    constructor(option) {
        if(!local_websocket || !local_websocket.IsOpen) {
            window.local_websocket = new WebSocket('ws://localhost:10091/websocket');
        }
        if(option.open) {
            local_websocket.onopen = option.open;
        } else {
            local_websocket.onopen = ()=> {
                local_websocket.connected();
            };
        }
        if(option.message) {
            local_websocket.onmessage = option.message;
        } else {
            local_websocket.onmessage = (data) => {
                local_websocket.responseMessage(data);
            };
        }
        if(option.error) {
            local_websocket.onerror = option.error;
        } else {
            local_websocket.onerror = () => {
                local_websocket.closed();
            }
        }
        local_websocket.onclose = () => {
            local_websocket.closed();
        }
    }

    send(data, callback=null) {
        local_websocket.sendRequest(data, callback);
    }
}

class WholeWebSocket {
    constructor(option) {
        if(!whole_websocket || !whole_websocket.IsOpen) {
            window.whole_websocket = new WebSocket('ws://127.0.0.1:7005');
        }
        if(option.open) {
            whole_websocket.onopen = option.open;
        } else {
            whole_websocket.onopen = ()=> {
                whole_websocket.connected();
            };
        }
        if(option.message) {
            whole_websocket.onmessage = option.message;
        } else {
            whole_websocket.onmessage = (data) => {
                whole_websocket.responseMessage(data);
            };
        }
        if(option.error) {
            whole_websocket.onerror = option.error;
        } else {
            whole_websocket.onerror = () => {
                whole_websocket.close();
            }
        }
        whole_websocket.onclose = () => {
            whole_websocket.closed();
        }
    }

    send(data, callback=null) {
        whole_websocket.sendRequest(data, callback);
    }
}

window.localWebSocket = (option) => {
    return new LocalWebSocket(option);
};

window.wholeWebSocket = (option) => {
    return new WholeWebSocket(option);
};