<template>
    <el-row class="p-label-button">
        <search-card @search="seach" @enter="seach" :params="totalData" :clears="clears">
            <div>
                <div class="inline">
                    <label>{{label}}</label>
                    <el-button @click.native="button_click(index)"
                               v-for="(item,index) in buttons"
                               :key="index"
                               :type="index==current?'primary':'default'"
                               class="button"
                               size="mini">{{item.name}}{{item.count | filterButton}}
                    </el-button>
                </div>
                <div class="inline ml-sm" style="margin-top:-3px">
                    <label>授权状态：</label>
                    <el-select v-model="totalData.token_valid_status"
                               placeholder="请选择"
                               class="inline input-width"
                               v-sf.token_valid_status
                               @change="change_author">
                        <el-option
                                :key="item.value"
                                v-for="item in authData"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-select v-model="totalData.snType"
                       class="inline input-width"
                       v-sf.snType>
                <el-option
                        :key="item.value"
                        v-for="item in snData"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="totalData.snText"
                      :placeholder="`请输入${changeLabel}...`"
                      class="inline width-super"
                      v-sf.snText>
            </el-input>
            <label class="inline ml-sm">站点：</label>
            <el-select v-model="totalData.site_id"
                       class="inline s-width-small"
                       v-sf.site_id
                       filterable  clearable
                       @change="change_site">
                <el-option
                        :key="item.value"
                        v-for="item in siteData"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="totalData.taskName"
                       class="inline s-width-default ml-sm"
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
            <el-select v-model="totalData.taskCondition"
                       class="inline"
                       style="width:60px"
                       v-sf.taskCondition
                       filterable>
                <el-option
                    v-for="res in conditionList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="totalData.taskTime"
                       class="inline s-width-small mr-sm"
                       v-sf.taskTime
                       filterable>
                <el-option
                    v-for="res in taskTimeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .p-label-button{
        .button{
            margin-bottom:3px;
        }
        .input-width{
            width: 100px;
        }
    }

</style>
<script>
    import {get_ebaysite} from "../../../../api/ebay-order"
    import  labelItems from "../../../../components/label-items.vue"
    export default{
        name: 'label-buttons',
        data(){
            return{
                current:0,
                selected:0,
                formValue:"",
                authData:[
                    {label:"全部",value:-1},
                    {label:"未授权",value:0},
                    {label:"已授权",value:1},
                ],
                taskNameList:[
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"抓取站内信数据",value:'download_message'},
                    {label:"同步付款状态",value:'sync_payment'},
                    {label:"同步发货状态",value:'sync_delivery'},
                    {label:"同步好评数据",value:'sync_feedback'},
                    {label:"抓取Listing数据",value:'download_listing'},
                ],
                conditionList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],
                siteData:[],
                snData:[
                    {label:"账户",value:"account_name"},
                    {label:"简称",value:"code"},
                ],
                clears:{
                    page:1,
                    pageSize:50,
                    snType:"account_name",
                    token_valid_status:-1,
                    is_invalid:-1,
                    taskName:"download_order",
                    taskCondition:"eq",
                }
            }
        },
        filters:{
            filterButton(count){
                if(count>0){
                    return `(${count})`
                }else{
                    return ''
                }
            }
        },
        mounted(){
    this.get_ebaysite()
        },
        computed:{
            changeLabel(){
                if(this.totalData.snType === 'account_name'){
                    return `账户`;
                }else{
                    return `简称`;
                }
            },
            taskTimeList() {
                let list1 = [
                    {label: "全部", value: ''},
                    {label: "未启用", value: 0},
                    {label: "30分钟", value: 30}
                ];
                let list2 = [
                    {label: "全部", value: ''},
                    {label: "未启用", value: 0},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "8小时", value: 480},
                    {label: "10小时", value: 600},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ];
                return this.totalData.taskName === 'download_listing' ? list2 : list1
            }
        },
        methods: {
            change_taskName(){
                this.totalData.taskTime = '';
            },
            get_ebaysite(){
                this.$http(get_ebaysite).then(res=>{
                    if(res.length>0){
                        res = res.map(row=>{
                            return {
                                label:row.code,
                                value:row.code
                            }
                        })
                        this.siteData = [{label:"全部",value:""},...res]
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            button_click(index){
                this.current = index;
            },
            seach(){
                this.$emit("seach")
            },
            clear_search(){
                  this.$emit("clear_search")
            },
            change_author(val){
                this.$emit("change-author",val)
            },
            change_site(val){
                this.$emit("change-site",val)
            },
        },
        watch:{
            current(newIndex){
                this.$emit("btn-select", newIndex);
            },
        },
        props:{
            buttons:{
                required:true,
                type:Array
            },
            label:{
                required:true,
                type:String
            },
            totalData:{
                required:true,
                type:Object
            }

        },
        components:{
            labelItems,
            searchCard:require('../../../../components/search-card.vue').default
        }
    }
</script>
