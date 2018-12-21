import config from '../config';
export default {
    data(){
        return {
            $websocket:null
        }
    },
    beforeCreate(){
        this.$websocket = new WebSocket(config.webSocket);
        this.$websocket.onmessage = (data) =>{
            this.$websocket.message(data);
        };
        this.$websocket.onopen = () =>{
            this.$websocket.connected();
        };
        this.$websocket.onclose = () =>{
            this.$websocket.closed();
        };
    },
    methods:{
        $sendCmd(cmd, data, callback = null){
            return this.$websocket.sendCmd(cmd, data, callback);
        },
        $subscibe(eventName, callback){
            this.$websocket.subscibe(eventName, callback);
        },
        $unsubscibe(eventName,callback = null){
            this.$websocket.unsubscibe(eventName, callback);
        }
    },
    destroy(){
        this.$websocket.unsubscibes();
        this.$websocket.close();
    }
};