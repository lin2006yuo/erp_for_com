<template>
    <div class="c-count-select.vue">
        <el-select v-model="value_" @change="change">
            <el-option v-for="item in lists" :key="item.value||item.id" :label="titleName" :value="item.value||item.id">
                <span style="float:left">{{item.label}}</span><span  style="float:right">({{item.count}})</span>
            </el-option>
        </el-select>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return {
               value_:"",
            }
        },
        mounted(){
            this.value_ = this.value;
        },
        watch:{
            value_(val){
                this.$emit("input",val);
            },
            value(val){
                this.value_ = val;
            },
            titleName(val){
                console.log(val);
            }
        },
        computed:{
            titleName(){
                if(this.lists instanceof Array){
                    let cur = this.lists.findRet(row=>{
                        if(row.value===this.value_ || row.id===this.value_){
                            if(row.count>0){
                                if(row.name) {
                                    return `${row.name}  (${row.count})`;
                                }else{
                                    return `${row.label}  (${row.count})`;
                                };
                            }else{
                                return row.name || row.label;
                            }
                        }
                    })
                    return cur;
                }
            }
        },
        methods:{
            change(){
                this.$emit("change");
            }
        },
        props:{
            lists:{
                required:true,
                type:Array
            },
            value:{}
        },
        components: {
//            uiSelect:require('./select-privately.vue').default,
        }
    }
</script>