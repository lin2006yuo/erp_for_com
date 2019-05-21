<template>
    <div class="new-window">
        new window
        <el-button @click="synchronizes">同步</el-button>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                event:null
            }
        },
        created(){
            window.addEventListener('message', event=> {
                if(event && event.data && event.data.key && event.data.key === 'ebay_open_window_tab'){
                    this.event = event;
                }
            })
        },
        methods:{
            synchronizes(){
                if(this.event){
                    console.log(this.event,'e');
                    this.$connectTab(this.event.source,'connect',{data:{message:'你收到了吗？'} , key:'ebay_open_window_tab'}).then(()=>{
                        console.log('已经发送啦！！！');
                        // window.close();
                    }).catch(code=>{
                        console.log(code,'code');
                    });
                }
            }
        },
        components:{
            integerInput:require('@/components/integer-input').default,
            integerZeroInput:require('@/components/integer-zero-input').default,
        }

    }
</script>
