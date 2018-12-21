<template>
    <span class="c-published-result">
        <el-popover v-if="rowData[rowKey] === 2" placement="left"
                    :title="get_title()"
                    width="400"
                    :trigger="propsTrigger">
            <div class="breakAll">{{get_message()}}</div>
            <span slot="reference">
                <span class="public-status error-status">{{label}}</span>
            </span>
        </el-popover>
        <el-popover v-else-if="rowData[rowKey] ===1&&!isShow"
                    placement="left"
                    :title="get_title()"
                    width="400"
                    :trigger="propsTrigger">
            <div class="breakAll">{{get_message()}}</div>
            <span slot="reference">
                 <!--<span class="public-status success-status">{{label}}</span>-->
                 <span class="public-status warning-status">{{label}}</span>
            </span>
        </el-popover>
        <span v-else-if="rowData[rowKey] ===1&&isShow" class="public-status success-status">{{label}}</span>
        <span v-else="rowData[rowKey] ===0" class="public-status loading-status">{{label}}</span>
        <span v-if="showSeparate">|</span>
    </span>
</template>
<style lang="stylus" scoped>
    .c-published-result{
        display:inline-block
        span{
            display:inline-block
        }
        .public-status{
            height:20px;
            box-sizing border-box;
            padding-right: 22px;
            padding-top:2px;
        }
        .success-status {
            background:url("../../../../assets/success.svg") no-repeat center right;
            background-size:contain;
        }
        .warning-status{
            background:url("../../../../assets/warning-correct.svg") no-repeat center right;
            background-size:contain;
        }
        .loading-status {
            background:url("../../../../assets/waiting (2).svg") no-repeat center right;
            background-size:contain;
        }
        .error-status {
            background:url("../../../../assets/errorTip.svg") no-repeat center right;
            background-size:contain;
        }

    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        computed:{
            isShow(){//判断成功时出现warning提示 true代表不需要使用warning提示
                return !this.rowData.error_message[this.rowKey]&&!this.rowData.warning_message[this.rowKey]
            },
        },
        methods:{
            get_title(){
                let errorMes = this.rowData.error_message[this.rowKey];
                let warningMes = this.rowData.warning_message[this.rowKey];
                if(errorMes&&warningMes){
                    return '警告&&失败原因';
                }else if(errorMes&&!warningMes){
                    return '失败原因';
                }else if(!errorMes&&warningMes){
                    return '警告';
                }else{
                    return '';
                }
            },
            get_message(){
                let errorMes = this.rowData.error_message[this.rowKey];
                let warningMes = this.rowData.warning_message[this.rowKey];
                if(errorMes&&warningMes){
                    return `【警告】： ${warningMes}  【失败原因】：${errorMes}；`;
                }else if(errorMes&&!warningMes){
                    return `【失败原因】：${errorMes}`;
                }else if(!errorMes&&warningMes){
                    return `【警告】：${warningMes}`;
                }else{
                    return '暂无错误提示信息';
                }
            },
        },
        props:{
            //触发方式  hover/click/focus
            propsTrigger:{
                type:String,
                default(){
                    return 'hover'
                }
            },
            //当前行数据
            rowData:{
                type:Object
            },
            label:{},
            //行key
            rowKey:{
                type:String,
            },
            showSeparate:{
                type:Boolean,
                default(){
                    return true;
                }
            }
        },
        components: {}
    }
</script>