<template>
    <el-row>
        <el-col :span="24">
            <el-progress :percentage="70"></el-progress>
            <button @click="ssss">ssss</button>
        </el-col>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>

    import {mapActions} from 'vuex';

    export default{
        data(){
            return {}
        },
        methods:{
                ...mapActions(['switcher']),
            ssss(){
                    console.log('ssss');
                    this.switcher(100);
            }
        },
        components: {}
    }
</script>
