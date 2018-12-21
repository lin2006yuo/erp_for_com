<template>
    <div class="p-search-list">
        <search-card :params="form" :clears="clears" @search="search" @enter="search">
            <el-row>
                <label-buttons class="inline" label="评价状态：" :buttons="comment" @select="select_comment" v-sf.comment_type ref="comment"></label-buttons>
                <label-buttons class="inline" label="回评状态：" :buttons="status" @select="select_status" v-sf.status ref="status"></label-buttons>
                <label-buttons class="inline" label="跟进状态：" :buttons="handel" @select="select_handel" v-sf.handel_status ref="handel"></label-buttons>
            </el-row>
            <el-select v-model="form.search_key" class="inline s-width-default"  v-sf.search_key>
                <el-option
                        :key="item.value"
                        v-for="item in options"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input class="inline s-width-large" v-model="form.search_val" v-sf.search_val></el-input>
            <label class="inline ml-sm">客服账号：</label>
            <el-select v-model="form.customer_id" class="inline s-width-large" filterable v-sf.customer_id >
                <el-option
                        :key="item.customer_id"
                        v-for="item in customerList"
                        :label="`${item.realname}/${item.username}`"
                        :value="item.customer_id">
                </el-option>
            </el-select>
            <!--  <label-select class="inline ml-sm" label="账号：" v-model="form.customer_id" :lists="accountList"></label-select>-->
            <label class="inline ml-sm">留评价时间：</label>
            <el-date-picker type="date" placeholder="开始时间" v-model="form.date_b"  :picker-options="pickerstart" class="inline" style="width:140px" v-sf.date_b></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-model="form.date_e"  :picker-options="pickerend" class="inline mr-sm" style="width:140px" v-sf.date_e></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_statusStatistics,
        api_get_customer,

        url_get_list
    } from '../../../api/eBay-estimate';
    export default{
        permission:{
            url_get_list
        },
        data(){
            return {
                 pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return  time.getTime() > this.form.date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.date_b){
                            return time.getTime() < this.form.date_b
                        }else {
                            return false
                        }
                    }
                },
                comment:[
                    {name:"全部",value:''},
                    {name:"好评",value:1},
                    {name:"中评",value:2},
                    {name:"差评",value:3},
                    {name:"已修改评价",value:4},
                    {name:"等待买家评价",value:99}
                ],
                //status:[],
                handel:[
                    {name:"全部",value:''},
                    {name:"需要处理",value:1},
                    {name:"处理完成",value:2}
                ],
                options:[
                    {label:"item_id",value:'item_id'}
                ],
                customerList:[],
                clears:{}
            }
        },
        created(){

        },
        mounted(){
            this.get_account();
            this.clears=clone(this.form)
        },
        methods: {
            init_status_btn(){
                this.$refs.comment.refresh();
                this.$refs.handel.refresh();
                this.$refs.status.refresh();
            },
            //获取客服账号数据
            get_account(){
                this.$http(api_get_customer).then(res=>{
                    this.customerList= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{
                   this.$message({message:code.message||code,type:'error'})
                })
            },
           //切换评价状态的按钮时修改列表传入的参数并刷新页面
            select_comment(index){
                this.form.comment_type = this.comment[index].value;
                this.$emit('refresh')
            },
            //切换回评状态的按钮时修改列表传入的参数并刷新页面
            select_status(index){
                this.form.status = this.status[index].id;
                this.$emit('refresh')
            },
            //切换跟进状态的按钮时修改列表传入的参数并刷新页面
            select_handel(index){
                this.form.handel_status = this.handel[index].value;
                this.$emit('refresh')
            },
            //搜索
            search(){
                this.$emit('refresh')
            },
            //清空搜索
            clear_search(){
                this.$emit('clear')
            }

        },
        filters: {},
        watch: {},
        computed: {},
        props: {
            form:{},
            status:{}
        },
        components: {
            labelButtons:require('../../order/wish/list/label-buttons.vue').default,
            labelSelect:require('../../../components/label-select.vue').default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
