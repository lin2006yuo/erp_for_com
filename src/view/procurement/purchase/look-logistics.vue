<template>
    <page-dialog size="full" v-model="show" :title="title" class="p-dialog-logistics" :close-on-click-modal="true" width="50%" left="10%">
        <div v-for="row in logisticsData" class="mb-lg">
            <el-row class="ml-sm" style="font-weight: bold">
                <span class="mr-xs">运输方式：{{row.logistics_company_name}}</span>
                <span class="ml-xs  mr-xs">运单号：{{row.logisticsBillNo}}</span>
                <span class="ml-xs  mr-xs">外部流水号：{{row.external_number}}</span>
            </el-row>
            <el-row class="mt-sm">
                <el-row class="mb-xs">
                    <el-col style="width:15%;text-align: center;">
                        <span style="color: #000">时间 <img width="12px" height="12px" src="../../../../src/assets/up-and-down.svg"></span>
                    </el-col>
                    <el-col style="width:85%;">
                        <div style="color: #000;margin-left: 10%">地点和跟踪进度</div>
                    </el-col>
                </el-row>
                <div class="logistics-data" v-for="(item,index) in row.logisticsSteps">
                    <el-col class="s-logistics-date" style="width:15%">
                        <div class="mt-xs" :style="index===0?'color:#F60;':''">
                            <div v-if="hasBr(row,index)" class="mt-xs"></div>
                            <span>{{item.acceptTime}}</span>
                        </div>
                    </el-col>
                    <el-col :span="1">
                        <div style="text-align: center">
                            <img width="15px" height="15px" style="margin-top:6px" v-if="index===0" src="../../../../src/assets/check-o.svg">
                            <img width="15px" height="15px" style="margin-top:6px" v-if="index>0&&index<row.logisticsSteps.length-1" src="../../../../src/assets/bottom-b.svg">
                            <img width="15px" height="15px" style="margin-top:6px" v-if="index===row.logisticsSteps.length-1" src="../../../../src/assets/circle-b.svg">
                        </div>
                    </el-col>
                    <el-col :span="19">
                        <div class="mt-xs" :style="index===0?'color:#F60;':''">
                            <div v-if="hasBr(row,index)" class="mt-xs"></div>
                            <span>{{item.remark}}</span>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
            <!--常用备注   一直存在页面-->
        <div slot="footer">
            <el-button size="mini" class="mr-sm" @click.native="cancel">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .logistics-data{
        height 32px;
        /*margin-left:2%;*/
        .s-logistics-date{
            text-align right;
        }
    }
</style>
<script>
    export default{
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'刘志勇',
                createTime:'2018-4-23',
                updateTime:'2017-4-24'
            }
        },
        data(){
            return{
                show:this.value
            }
        },
        methods:{
            cancel(){
                this.show = false;
            },
            hasBr(row,index){
                return index>0&&row.logisticsSteps[index].acceptTime.length>8&&row.logisticsSteps[index].acceptTime.length===row.logisticsSteps[index-1].acceptTime.length
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
        },
        props:{
            value:{},
            logisticsData:{
                type: Array
            },
            loadingLogistics:{
                type:Boolean
            },
            showLogistics:{
                type:Boolean
            },
            title:{
                type:String
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
