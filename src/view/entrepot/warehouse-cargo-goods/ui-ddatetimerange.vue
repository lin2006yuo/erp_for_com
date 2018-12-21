<template>
    <div style="display: flex !important;align-items: center;" class="times">
        <el-date-picker
                v-sf.range_b_time
                class="date"
                size="mini"
                clearable
                v-model="range_b_time"
                type="date"
                placeholder="开始时间"
                :value-format="format"
                :picker-options="inputTimeStart">
        </el-date-picker>
        --
        <el-date-picker
                v-sf.range_e_time
                class="date"
                size="mini"
                clearable
                v-model="range_e_time"
                type="date"
                placeholder="结束时间"
                :value-format="format"
                :picker-options="inputTimeEnd">
        </el-date-picker>
    </div>
</template>
<style lang="stylus">
    .times{
        .el-input--mini .el-input__inner{
            height:26px !important;
        }
    }
</style>
<script>
    /*
    * @use  <datetimerange @range_b_time="(v)=>{date_b = v}" @range_e_time="(v)=>{date_e = v}" :format='format'></datetimerange>
    * @param {date_b:String}    开始时间
    * @param {date_e:String}    结束时间
    * @param {format:String}    时间格式化格式,默认是'yyyy-MM-dd'
    * @author chenganxu
    * */
    export default {
        name:'uiDdatetimerange',
        data() {
            return {
                range_b_time:this.b_time,
                range_e_time:this.e_time,
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.range_e_time){
                            return time.getTime() > new Date(this.range_e_time).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.range_b_time) {
                            return time.getTime() < new Date(this.range_b_time).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        mounted() {
        },
        methods: {},
        watch: {
            range_b_time(val){
                let v = val?datef(this.format,(new Date(val)).getTime()/1000):val;
                this.$emit('update:b_time',v)
            },
            range_e_time(val){
                let v = val?datef(this.format,(new Date(val)).getTime()/1000):val;
                this.$emit('update:e_time',v)
            },
        },
        props: {
            b_time:'',
            e_time:'',
            format:{
                type:String,
                default(){
                    return 'YYYY-M-dd'
                }
            },
        },
        components: {}
    }
</script>
