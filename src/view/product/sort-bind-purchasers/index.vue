<template>
   <page>
       <search :search-data="searchData" :clears="clears" @search="search" :purchasing="purchasing" class="mb-xs"></search>
       <table-list :table-data="tableData" :loading="loading" :first-time="firstTime" @edit="edit" @check="check" @size-change="size_change"
                   @current-change="current_change"
                   @log-operate="log_operate"
       ></table-list>
       <operate v-model="operate_show" :title="title" :purchaser="purchaser"  :resId="resId" :purchasing="copyPurchasing" @search="search" :purchaser_id="purchaser_id"></operate>
       <log-dialog v-model="log_show" :title="title" :table-data="dialog_data"></log-dialog>
   </page>
</template>

<script>
    import {getUser,api_get_categories,api_get_log} from '../../../api/sort-bind-purchasers';
    export default {
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'詹老师',
                creatTime:'2018-10',
                updateTime:'2018-10'
            }
        },
        data() {
            return {
                purchaser_id:'',
                log_show:false,
                purchasing:null,
                loading:false,
                firstTime:true,
                operate_show:false,
                title:'',
                copyPurchasing:null,
                resId:'',
                purchaser:'',
                searchData: {
                    purchaser_id:'',
                    page: 1,
                    pageSize: 50,
                },
                tableData:{
                        totalSize: 0,
                        lists: [],
                        page: 1,
                        pageSize: 50,
                        total:0,
                },
                dialog_data:[],
                clears:{
                    page:1,
                    pageSize:50,
                    purchaser_id:'',
                }
            }
        },
        mounted(){
            this.$http(getUser).then(res=>{
                this.purchasing = res;
                 this.purchasing.unshift({id:'',realname:'全部'});
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            }).catch(code=>{

            });
            this.init()
        },
        methods: {
            search() {
                this.init()
            },
            log_operate(val){
                let id = val.id;
                this.$http(api_get_log,id).then(res=>{
                    this.dialog_data = res.reverse().filter(row=>!row.remark.includes('新增'));
                    this.dialog_data.forEach(row=>{
                        let t1 = row.remark.split(':');
                        let t2 = t1.splice(t1.length-1,1);
                        let t3 = t2.join('=>');
                        let t4 = t3.split('=>');
                        let title = `将采购员${t4[0]}修改为${t4[1]}`;
                        this.$set(row,'title',title)
                    });
                    this.$nextTick(()=>{
                        this.log_show=true
                    })
                });
                let name = val.name_path.replace(/-/g,'>>');
                this.title=`查看分类: ${name}的操作日志`;
            },
            edit(val){
                let name = val.name_path.replace(/-/g,'>>');
                this.copyPurchasing = JSON.parse(JSON.stringify(this.purchasing));
                this.purchaser_id=val.purchaser_id;
                this.copyPurchasing.forEach((row,index,arr)=>{
                    if(row.realname.includes('全部')){
                        arr.splice(index,1)
                    }
                });
                this.title=`修改分类：${name}绑定的采购员`;
                this.operate_show=true;
                this.resId=val.id;
                this.purchaser=val.purchaser;
            },
            check(val){
                let name = val.name_path.replace(/-/g,'>>');
                let id = {id:val.id};
                this.operate_show=true;
                this. purchaser=val.purchaser;
                this.title=`查看分类: ${name}绑定的采购员`;
            },
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                this.tableData.page&&(data.page=this.tableData.page);
                this.tableData.pageSize &&(data.pageSize = this.tableData.pageSize);
                this.$http(api_get_categories,data).then(res=>{
                    this.loading=false;
                    this.firstTime=false;
                    if(Array.isArray(res.data[res.data.length-1])){
                        res.data.splice(res.data.length-1,1);
                        this.tableData.lists = res.data.filter(row=>{
                            if(row.name_path.split('-').length>1){
                                        return row
                                    }
                        })
                    }else {
                        this.tableData.lists = res.data.filter(row=>{
                            if(row.name_path.split('-').length>1){
                                return row
                            }
                        });
                    }
                    console.log('res.data',res.data.length-1);
                    this.tableData.page=Number(res.page);
                    this.tableData.pageSize=Number(res.pageSize);
                    this.tableData.total = res.count-1
                }).catch(err=>{
                    console.log(err);
                })
            },
            current_change(val) {
                this.tableData.page = val;
                this.init();
            },
            size_change(val) {
                this.tableData.pageSize = val;
                this.init();
            },
        },
        components:{
            search:require('./search').default,
            tableList:require('./table-list').default,
            operate:require('./operate').default,
            logDialog:require('./log-dialog').default,
        }
    }
</script>

<style scoped>

</style>