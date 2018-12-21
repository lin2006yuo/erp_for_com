<template>
    <div class="p-ui-timepick inline">
        <label>{{label}}：</label>
        <el-date-picker
                ref="start"
                v-model="searchData.start"
                type="date"
                class="date inline"
                placeholder="开始时间"
                :picker-options="pickerstart">
        </el-date-picker> --
        <el-date-picker
                v-model="searchData.end"
                type="date"
                class="date inline"
                placeholder="结束时间"
                ref="end"
                :picker-options="pickerend">
        </el-date-picker>
    </div>
</template>
<style lang="stylus">

</style>
<script >
    export default{
    data(){
             return{
                start:"",
                 end:"",
                 pickerstart:{
                     disabledDate:(time)=>{
                         if(this.searchData.end){
                            return  time.getTime() > this.searchData.end.getTime()
                         }else {
                             return false
                         }
                     }
                 },
                 pickerend:{
                     disabledDate:(time)=>{
                         if(this.searchData.start){
                             return time.getTime() < this.searchData.start.getTime()
                         }else {
                             return false
                         }

                     }
                 }
             }
    },
    created(){
    },
    mounted(){
    },
    computed:{
    },
    methods:{
    },
    filters:{
    },
    watch:{
    },
    props:{
        label:{
            required:true,
            type:String
        },
        searchData:{
            required:true,
            type:Object
        }
    },
    components:{

    }
    }
</script>