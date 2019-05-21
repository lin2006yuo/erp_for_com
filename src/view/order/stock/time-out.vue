<template>
    <div class="c-time-out">
        <span :class="{red:count_down(time,curStatus)}">{{timedown(time,curStatus)}}</span>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default {
        data() {
            return {}
        },
        computed:{
            now(){
                return Math.ceil(new Date().getTime()/1000)
            },
        },
        methods:{
            timedown(time,curStatus){
               let sec = time - this.now;
                sec = Math.max(sec,0);
                let d = Math.floor(sec/86400);
                let h = Math.floor((sec-(d*86400))/3600);
                let m = Math.floor((sec-(h*3600+d*86400))/60);
                if(curStatus){
                    return "已标记";
                } else {
                    if(!!curStatus){
                        return "已发货"
                    }else if(!d&&!h&&!m){
                        return "已超时"
                    }else{
                        return `${d}天${h}时${m}分`;
                    }
                }
            },
            count_down(time,curStatus) {
                let curTime = Math.floor((time - this.now) / 86400);
                return !curStatus && curTime < 1 ? true : false
            }
        },
        props:{
            curStatus:{//判断当前是否已发货
                required:true
            },
            time:{//最迟发货时间
                required:true
            },
        },
        components: {}
    }
</script>