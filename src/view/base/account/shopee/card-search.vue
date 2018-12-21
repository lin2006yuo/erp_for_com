<template>
    <div class="c-card-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div>
                <label-buttons
                    label="状态："
                    :buttons="userStatus"
                    @select="change_select"
                    class="inline">
                </label-buttons>
                <div class="inline mb-mini">
                    <label class="inline ml-sm">授权状态：</label>
                    <el-select
                        class="inline width-xs"
                        v-sf.authorization
                        v-model="searchData.authorization"
                        placeholder="请选择">
                        <el-option
                            v-for="item in authorList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-select class="inline s-width-small"
                       v-sf.sn_type
                       v-model="searchData.sn_type">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.sn_text
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="searchData.sn_text"
                      @input="keyword"
            ></el-input>
            <el-select class="inline s-width-large ml-sm"
                       v-sf.download_type
                       v-model="searchData.download_type"
                       @change="change_taskName"
                       filterable>
                <el-option
                    v-for="res in taskNameList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.download_exec"
                       class="inline"
                       style="width:60px"
                       v-sf.download_exec
                       filterable>
                <el-option
                    v-for="res in taskList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"></el-option>
            </el-select>
            <el-select v-model="searchData.download_value"
                       class="inline s-width-small"
                       v-sf.download_value
                       filterable>
                <el-option
                    v-for="res in taskTimeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm  mr-sm">站点：</label>
            <el-select class="inline s-width-small mr-sm"
                       v-sf.site
                       v-model="searchData.site"
                       filterable clearable>
                <el-option v-for="item in siteList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
//    import {api_shopee_site} from '../../../../api/shopee';
	export default{
		data(){
			return {
                userStatus:[
                    {name:"全部",status:0},
                    {name:"已启用",status:1},
                    {name:"已停用", status:2}
                ],
                authorList: [
                    {value: '',label: '全部'},
                    {value: '0',label: '未授权'},
                    {value: '1',label: '已授权'},
                ],
                conditionList:[
                    {value: 'name',label: '账户'},
                    {value:'code',label: '简称'}
                ],
                taskNameList:[
                    {label:"抓取Listing数据",value:'download_listing'},
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"同步发货状态",value:'sync_delivery'},
                ],
                taskList:[
                    {label:"=",value:'0'},
                    {label:"<",value:'1'},
                    {label:">",value:'2'},
                ],
                taskTimeList: [
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
                ],
            }
		},
        methods:{
//			状态/全部、启用、停用
            change_select(index){
                let fSelect = this.userStatus[index].status;
                if (fSelect === 0) {
                    delete this.searchData.platform_status;
                }else if (fSelect === 1) {
                    this.searchData.platform_status = 1;
                }else if (fSelect === 2) {
                    this.searchData.platform_status = 0;
                }
                this.$emit("change-select");
            },
//           输入
            keyword(){
                this.$emit("key-word");
            },
//          抓取数据
            change_taskName(){
                this.$emit("change-taskName");
            },
            search(){
                this.$emit("search");
            },
        },
        props:{
            searchData:{},
            clears:{},
            siteList:{
                required:true,
                type:Array,
            }
        },
        computed: {
            changeLabel(){
                if (this.searchData.sn_type === 'name') {
                    return `账户`;
                } else {
                    return `简称`;
                }
            }
        },
		components: {
            labelButtons:require('../../../../components/label-buttons.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
        }
	}
</script>
