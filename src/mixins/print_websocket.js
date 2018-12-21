export default {
    data() {
        return {
            $websocket: null
        }
    },
    beforeCreate() {
        this.$websocket = new WebSocket('ws://localhost:10091/websocket');
        this.$websocket.onmessage = (data) => {
            this.$websocket.responseMessage(data);
        };
        this.$websocket.onopen = () => {
            this.$websocket.connected();
        };
        this.$websocket.onclose = () => {
            this.$websocket.closed();
        };
        this.$websocket.onerror = (evt) => {
            console.log('websocket error', evt);
        }
    },
    methods: {
        $sendRequest(data, callback = null) {
            return this.$websocket.sendRequest(data, callback);
        }
    },
    destroy() {
        this.$websocket.close();
    }
};