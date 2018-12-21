<template>
    <search-card @search="search" @enter="search"
                 :params="searchData" :clears="clears">
        <div>
            <label-buttons label="状态："
                           :buttons="userStatus"
                           @select="change_select"
                           class="inline"></label-buttons>
            <div class="inline mb-mini">
                <label class="inline ml-sm">授权状态：</label>
                <el-select class="inline s-width-small"
                           v-sf.authorization
                           v-model="searchData.authorization"
                           @change="selected">
                    <el-option v-for="item in authorList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </div>
        </div>
        <el-select class="inline s-width-small" v-sf.snType
                   v-model="searchData.snType">
            <el-option v-for="item in conditionList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
        </el-select>
        <el-input class="inline mr-sm"
                  v-sf.snText
                  :placeholder="`请输入${changeLabel}...`"
                  v-model="searchData.snText"></el-input>
        <el-select v-model="searchData.taskName"
                   class="inline s-width-middle ml-sm"
                   v-sf.taskName
                   @change="change_taskName"
                   filterable>
            <el-option
                    v-for="res in taskNameList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
            ></el-option>
        </el-select>
        <el-select v-model="searchData.taskCondition"
                   class="inline"
                   style="width:60px"
                   v-sf.taskCondition
                   filterable>
            <el-option
                    v-for="res in taskList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"></el-option>
        </el-select>
        <el-select v-model="searchData.taskTime"
                   class="inline s-width-small mr-sm"
                   v-sf.taskTime filterable>
            <el-option
                    v-for="res in taskTimeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
            ></el-option>
        </el-select>
    </search-card>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                userStatus:[
                    {name:"全部",status:0},
                    {name:"已启用",status:1},
                    {name:"已停用", status:2}
                ],
                taskNameList:[
                    {label:'抓取订单数据',value:'download_order'},
                    {label:'同步发货状态',value:'sync_delivery'},
                    {label:'抓取Listing数据',value:'download_listing'},
                    {label:'同步健康数据',value:'download_health'},
                ],
                taskList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],
                authorList:[
                    {value: 0,label: '未授权'},
                    {value: 1,label: '已授权'},
                    {value: -1,label: '全部'}
                ],
                conditionList:[
                    {value: 'account_name',label: '账户'},
                    {value:'code',label: "简称"}
                ],
            }
        },
        computed:{
            changeLabel(){
                return this.searchData.snType === 'account_name'?'账户':'简称';
            },
            taskTimeList(){
                let list1 = [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:"15分钟",value:15},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                ];
                let list2 = [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ];
                return (this.searchData.taskName==='download_listing'||this.searchData.taskName==='download_health')?list2:list1;
            },
        },
        methods:{
            search(){
                this.$emit('search');
            },
            change_select(select){//----------------更改启用/禁用/全部按钮时的事件
                switch(select){
                    case 0:
                        delete this.searchData.status;
                        break;
                    case 1:
                        this.searchData.status = true;
                        break;
                    case 2:
                        this.searchData.status = false;
                        break;
                }
                this.$emit('change-select');
            },
            selected(val){
                this.searchData.authorization = val;
                this.$emit('selected');
            },
            change_taskName(){
                this.searchData.taskTime = '';
            },
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clears:{
                type:Object,
                required:true
            }
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
        }
    }
</script>