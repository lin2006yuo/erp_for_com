<template>
    <search-card @search="$emit('search')"
                 @enter="$emit('search')"
                 :params="searchData"
                 :clears="clears">
        <el-row>
            <label-buttons label="状态："
                           :buttons="status"
                           @select="select_status">
            </label-buttons>
        </el-row>
        <label-item label="手机号运营公司：" >
            <el-select class="width-md"
                       v-model="searchData.operator"
                       filterable
                       clearable
                       placeholder="请选择">
                <el-option
                        v-for="item in mobileCompany"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="猫池：" >
            <el-select class="width-md"
                       v-model="searchData.cat_pool"
                       filterable
                       clearable
                       placeholder="请选择">
                <el-option
                    v-for="item in catPools"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="手机号：" class="ml-sm">
            <el-input type="text"
                      clearable
                      v-model="searchData.phone"
                      class="s-width-middle">
            </el-input>
        </label-item>

        <label-item  label="注册账号数：" class="ml-sm phone-label-item">
            <el-input type="number"
                      clearable
                      v-model="searchData.account_count_st"
                      @blur="blurStart"
                      class="s-width-mini ml-xs">
            </el-input>
            <span>&nbsp;~</span>
            <el-input type="number"
                      clearable
                      @blur="blurEnd"
                      v-model="searchData.account_count_nd"
                      class="s-width-mini ml-xs">
            </el-input>
        </label-item>

        <label-item label='注册日期：' class="ml-sm">
            <el-date-picker type="date"
                    placeholder="选择日期"
                    class="inline date"                            
                    :picker-options="inputTimeStart"
                    v-model="searchData.reg_time_st">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>            
            <el-date-picker type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"            
                    :picker-options="inputTimeEnd"
                    v-model="searchData.reg_time_nd">
            </el-date-picker>
        </label-item>
    </search-card>
</template>

<style lang="stylus" scoped>
.phone-label-item{
    .el-input{
        width 80px;
    }
}

</style>

<script>
    import labelButtons from '@/components/label-buttons.vue';
    import labelItem from '@/components/label-item.vue'
    import {api_get_cat_pool} from '@/api/phone-management'
    export default {
        name: "search",
        page:{
            devinfo:{
                frontEnd:'文军辉',
                backEnd:'',
                createTime:'2019-1-7',
                updateTime:'2019-1-7'
            }
        },
        data() {
            return {
                status:[
                    {label:'全部',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ],
                catPools:[],
                mobileCompany:[
                    {label:'全部', value: ''},
                    {label:'电信', value: 1},
                    {label:'移动', value: 2},
                    {label:'联通', value: 3},
                ],
                taskList:[
                    {label:">=",value:'>='},
                    {label:">",value:'>'},
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.reg_time_nd) {
                            return time.getTime() > this.searchData.reg_time_nd;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.reg_time_st) {
                            return time.getTime() < this.searchData.reg_time_st;
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted() {
            this.get_cat_pool();
        },
        computed: {},
        watch: {},
        methods: {
            select_status(index,item){
                this.searchData.status=item.value;
                this.$emit('search');
            },
            blurStart() {
                if (this.searchData.account_count_st !== '' && this.searchData.account_count_st < 0) {
                    this.$message({
                        type:'warning',
                        message:'请输入大于等于0的自然数'
                    });
                    this.searchData.account_count_st = "";
                }
                else if(this.searchData.account_count_nd && this.searchData.account_count_nd<=this.searchData.account_count_st){
                    this.$message({
                        type:'warning',
                        message:'左边的值不得大于右边'
                    });
                    this.searchData.account_count_st = '';
                }
            },
            blurEnd() {
                if (this.searchData.account_count_nd !== '' && this.searchData.account_count_nd < 1) {
                    this.$message({
                        type:'warning',
                        message:'请输入大于等于0的自然数'
                    });
                    this.searchData.account_count_nd = '';
                }
                else if(this.searchData.account_count_st && this.searchData.account_count_nd<=this.searchData.account_count_st){
                    this.$message({
                        type:'warning',
                        message:'右边的值不得小于左边'
                    });
                    this.searchData.account_count_nd = '';
                }
            },
            get_cat_pool(){
                this.$http(api_get_cat_pool,{name:'site_cat_pool'})
                    .then(res=>{
                        this.catPools=[{key:'全部',value:''},...JSON.parse(res.data[0].setting)];
                    })
                    .catch(err=>{
                        console.log(err.message);
                    })
            },
        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            }
        },
        components: {
            labelButtons,
            labelItem
        },
    }
</script>

