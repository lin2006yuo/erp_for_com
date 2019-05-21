<template>
    <page>
        退出成功！！！
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {quit} from '../auth';
    export default{
        data(){
            return{

            }
        },
        mounted(){
            quit();
            setTimeout(()=>{
                this.$open('/login');
                this.$close('/quit');
            },3000);
        },
        components:{

        }
    }
</script>