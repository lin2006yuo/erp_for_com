<template>
    <roll-select v-model="valueData"
                 :time-out="comTimeOut"
                 @change="change"
                 :adjust-structure="adjustStructure"
                 :adjust-params="adjustParams"
                 :storage-key="storageKey"
                 :options="options"
                 :remote-request-http="remoteRequestHttp">
        <slot></slot>
    </roll-select>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                valueData:this.value,
            }
        },
        mounted(){
        },
        methods:{
            change(row,index){
                this.$emit('change',row,index);
            },
        },
        computed:{
            comTimeOut(){
                return {
                    contentType: 'application/x-www-form-urlencoded',
                    timeout:this.apiTimeOut
                }
            },
        },
        watch:{
            valueData(val){
                this.query = val;
                if(this.isDebug){
                    console.log(`watch valueData ${val}`);
                }
                this.$emit('input',val);
            },
            value(val){
                this.query = val;
                if(this.isDebug){
                    console.log(`watch value ${val}`);
                }
                this.valueData = val;
            },

        },
        props:{
            value:{},
            /*api请求超时时间
            * */
            apiTimeOut:{
                type:[Number,String],
                default(){
                    return INFINITE
                }
            },
            /*直接给数组的情况
            * */
            options:{
                type:Array,
                default(){
                    return [];
                }
            },
            /*需要调用url的情况传参
            * 参数为 url，params
            * */
                remoteRequestHttp:{
                type:Function,
                default(page, pageSize, filterString){
                    return false
                }
            },
            /*storage.js 使用的key，不同数据key不要相同
            * */
            storageKey:{
                type:String,
                required:true
            },
            /*是否使用后端分页的组件
            * */
            isPaging:{
                default(){
                    return false
                }
            },
            /*调整数据结构
            * */
            adjustStructure:{
                type:Function,
                default(res){
                    return res
                }
            },
            /*调整参数
            * */
            adjustParams:{
                type:Function,
                default(res){
                    return res
                }
            },
            page:{
                type:Number,
                default(){
                    return 1
                }
            },
            pageSize:{
                type:Number,
                default(){
                    return 30
                }
            },
            remote:{
                default(){
                    return true
                }
            },
            filterable:{
                default(){
                    return true
                }
            },
            clearable:{
                default(){
                    return true
                }
            },
            disabled:{
                default(){
                    return false
                }
            },
            placeholder:{
                default(){
                    return '输入选择更多';
                }
            },
            debug:{}
        },
        components: {
            rollSelect:require('@/components/roll-select').default,
        }
    }
</script>
