<template>
    <search-card @search="search" @enter="search" :params="paramList" :clears="clears">
        <el-select v-sf.snType
                   filterable
                   v-model="paramList.snType"
                   :account-list="accountList"
                   :user-list="userList"
                   class="inline mb-mini s-width-default" >
            <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="请输入搜索内容..." v-sf.snText v-model="paramList.snText" class="inline mr-sm mb-mini s-width-large" ></el-input>
        <label-item label="平台账号：" class="mr-sm mb-mini">
            <el-select class="inline s-width-middle" v-sf.account_id
                       filterable
                       clearable
                       v-model="paramList.account_id"
                       @change="select_account">
                <el-option v-for="item in accountList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="平台店铺：" class="mr-sm mb-mini">
            <el-select class="inline s-width-middle"
                       filterable
                       clearable
                       v-sf.shop_id
                       :disabled="storeIsDisable"
                       v-model="paramList.shop_id">
                <el-option v-for="item in shopList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="销售员：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       filterable
                       clearable
                       v-sf.create_id
                       v-model="paramList.create_id">
                <el-option v-for="item in userList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="审核状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       filterable
                       v-sf.review_status
                       v-model="paramList.review_status">
                <el-option v-for="item in reviewList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item class="mr-sm mb-mini">
            <el-select v-sf.sectionType
                       v-model="paramList.sectionType"
                       class="inline s-width-small" >
                <el-option v-for="item in sectionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="inline">&nbsp;</span>
            <el-input v-sf.min_text v-model="paramList.min_text" class="inline s-width-default"></el-input>
            <span class="inline">--</span>
            <el-input v-sf.max_text v-model="paramList.max_text" class="inline s-width-default"></el-input>
        </label-item>
        <label-item label="平台状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       v-sf.variant_enabled
                       v-model="paramList.variant_enabled">
                <el-option v-for="item in enableList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="修改状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       v-sf.lock_update
                       v-model="paramList.lock_update">
                <el-option v-for="item in statusList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="本地状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       v-sf.sell_status
                       v-model="paramList.sell_status">
                <el-option v-for="item in saleList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label class="mr-sm mb-mini">上传时间：</label>
        <el-date-picker class="inline date mb-mini" v-sf.min_time
                        v-model="paramList.min_time" type="date"
                        :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
        --
        <el-date-picker class="inline date mb-mini" v-sf.max_time
                        v-model="paramList.max_time" type="date"
                        :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
    </search-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_joom_store,} from '../../../../api/joom-set-classify'
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.paramList.max_time){
                            return  time.getTime() > this.paramList.max_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.paramList.min_time){
                            return  time.getTime() < this.paramList.min_time;
                        }else {
                            return false
                        }
                    }
                },
                clears:{
                    account_id:"",
                    shop_id:"",
                    snType:"local_sku",
                    sectionType:"price",
                    snText:"",
                },
                shopList:[],
                goods:[
                    {
                        label: '本地SKU',
                        value: 'local_sku',
                    },
                    {
                        label: '本地SPU',
                        value: 'local_spu',
                    },
                    {
                        label: '平台SKU',
                        value: 'platform_sku',
                    },
                    {
                        label: '平台SPU',
                        value: 'platform_spu',
                    },
                    {
                        label: '平台产品ID',
                        value: 'product_id',
                    },
                    {
                        label: '刊登标题',
                        value: 'name',
                    },
                ],
                reviewList:[//审核状态
                    {label:"全部",value:""},
                    {label:"待审核",value:0},
                    {label:"已批准",value:1},
                    {label:"被拒绝",value:2},
                ],
                enableList:[//平台状态
                    {label:"全部",value:""},
                    {label:"下架",value:0},
                    {label:"上架",value:1},
                ],
                statusList:[//修改状态
                    {label:"全部",value:""},
                    {label:"待同步",value:0},
                    {label:"更新成功",value:1},
                    {label:"更新失败",value:2},
                ],
                saleList:[ //本地状态
                    {label:"全部",value:""},
                    {label:"在售",value:1},
                    {label:"停售",value:2},
                    {label:"待发布",value:3},
                    {label:"卖完下架",value:4},
                    {label:"缺货",value:5},
                ],
                sectionList:[ //选项列表
                    {label:"销售价",value:"price"},
                    {label:"运费",value:"shipping"},
                    {label:"可售量",value:"inventory"},
                ]
            }
        },
        methods:{
            search(){
                this.$emit("search",this.paramList);
            },
            // 选择了账号
            select_account(val){
                if(val === ''){
                    this.paramList.shop_id = '';
                    this.shopList = [];

                }else {
                    this.paramList.shop_id = '';
                    this.get_joom_store();
                }
            },
            //获取店铺列表
            get_joom_store(){
                this.$http(api_get_joom_store, {joom_account_id:this.paramList.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
                })
            },
        },
        computed: {
            storeIsDisable(){
                return this.paramList.account_id === '';
            }
        },
        props:{
            paramList:{
                required:true,
                type:Object
            },
            accountList:{
                required: true,
                type: Array
            },
            userList:{
                required: true,
                type: Array
            }
        },
        components: {
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
        }
    }
</script>
