<template>
    <page class="p-index over-flow-auto overflow-visible" >
        <card-search :form="form" :clears="clears" @search="search"></card-search>
        <div class="mt-sm mb-sm ml-sm">
            <permission tag="ElButton"
                        size="mini" type="primary"
                        @click.native="batch_change_title"
                        :route="apis.url_batch_save_title">批量标题修改</permission>
        </div>
        <table-list :loading="loading"
                    :first-time="firstTime"
                    :tableData="tables"
                    @size-change="size_change"
                    @desc-edit="desc_edit"
                    @current-change="current_change"
                    @selection-change="selection_change"
                    @edit="edit"></table-list>
        <batch-change-title v-model="batchDialog"
                            @submit="submit"
                            :detail-list="choiceData"></batch-change-title>
        <single-edit v-model="show"
                     :title="singleTitle"
                     @submit="submit"
                     :form="info"
                     :src="src"></single-edit>
        <desc-dialog v-model="descShow"
                     :desc-data="descData"
                     :title="singleTitle">
        </desc-dialog>
    </page>
</template>
<style lang="stylus">

    .overflow-visible {
        .page-dialog{
        }
    }
</style>
<script>
    import {api_ebay_titles,api_edit_ebay_titles,api_batch_edit_title,
        api_get_goods_desc,api_save_goods_desc,
        url_batch_save_title,url_edit_ebay_titles} from  '../../../../api/ebay-title-key'
    export default {
        permission:{
            url_batch_save_title
        },
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'王留伟',
                creatTime:'2018-11-5',
                updateTime:'2018-11-10'
            }
        },
        data() {
            return {
                descData:{},
                spuId:'',
                singleTitle:'',
                title:'',
                titleList:[],
                show:false,
                descShow:false,
                loading: false,
                firstTime: true,
                batchDialog:false,
                detailList:[],
                info:{},
                form: {
                    is_desc_edit:'',
                    searchType:'spu',
                    searchContent:'',
                    localCategoryId:'',
                    startDate:(Date.now()-30*24*60*60*1000),
                    endDate:Date.now()
                },
                tables:{
                    page:1,
                    pageSize:50,
                    lists:[],
                    total:0
                },
                clears:{
                    searchType:'spu',
                    searchContent:'',
                    localCategoryId:'',
                },
                choiceData:[],
                goodsIds:[],
                src:'',
                description:'',
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            show_desc(){
                this.descShow=true;
            },
            arrangement_data(listData){
                listData.forEach(item=>{
                    if(item['titles']&&item['titles']['en']){
                        let obj = {
                            frontList:[],
                            middleList:[],
                            backList:[]
                        };
                        let titleStore = item['titles']['en']['titleStore'];
                        if(titleStore){
                            obj.frontList = this.add_name(titleStore['front'],false);
                            obj.middleList = this.add_name(titleStore['middle'],false);
                            obj.backList = this.add_name(titleStore['back'],false);

                        }else{
                            let enTitle = item['titles']['en'].titleStore||item['titles']['en'].originTitle;
                            let data = enTitle.split(' ').filter(row=>!!row);
                            obj.middleList = this.add_name(data,true);
                        }
                        this.$set(item,'sourceData',obj);
                    }
                });
                return listData;
            },
            add_name(list,isUpperCase){
                return list.map(row=>{
                    if(isUpperCase){
                        row = row.toString().substr(0,1).toUpperCase()+row.substr(1)
                    }
                    return {
                        time:0,
                        name:row,
                        isSign:false,
                    }
                })
            },
            batch_change_title(){
                if(this.goodsIds.length<=0)return this.$message({type:'warning',message:'请先选择需要批量更改的数据！'});
                this.batchDialog = true;
                this.choiceData = [];
                this.$http(api_batch_edit_title,{goodsIds:this.goodsIds}).then(res =>{
                    if(!res.data||res.data.length<=0)return this.$message({type:'',message:'publish/ebay/titles/batch 接口数据返回有误！'});
                    this.choiceData = this.arrangement_data(res.data);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                });
            },
            desc_edit(val){//描述编辑
                this.singleTitle = `SPU：${val.spu}编辑详情描述`;
                this.descShow=true;
                let data = {goods_ids:val.goods_id}
                this.$http(api_get_goods_desc,data).then(res=>{
                    this.descData=res.data.find(row=>{
                        return row.spu===val.spu;
                    })
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code})
                })
            },
            edit(val){//标题编辑
                this.singleTitle = `SPU：${val.spu}编辑标题`;
                this.info = {};
                this.src=val.thumb;
                this.$http(api_edit_ebay_titles,val.goods_id).then(res=>{
                    if(Object.keys(res.data).length<=0)return this.$message({type:'warning',message:'publish/ebay/titles/:goods_id 接口数据返回有误！'});
                    this.show = true;
                    this.info = this.arrangement_data([res.data])[0];
                    delete this.info.titles;
                    this.$set(this.info,'goods_id',val.goods_id);
                })
            },
            search() {
                this.init()
            },
            init(){
                this.loading = true;
                let data = this.init_params();
                this.$http(api_ebay_titles,data).then(res=>{
                    if(res.data&&res.data.list){
                        this.tables.lists = res.data.list;
                        this.tables.lists.forEach(row=>{
                            let arr = row.name.split('|');
                            this.$set(row,'cnTitle',arr[0]);
                            this.$set(row,'enTitle',arr[1])
                        });
                        this.tables.total = res.data.count;
                    }
                    this.loading = false;
                    this.firstTime = false;
                }).catch(err=>{
                    this.loading = false;
                    this.firstTime = false;
                    console.log(err);
                })
            },
            init_params(){
                let data = clone(this.form);
                data.startDate = data.startDate?datef('YYYY-MM-dd', new Date(data.startDate).getTime()/1000):'';
                data.endDate = data.endDate?datef('YYYY-MM-dd', new Date(data.endDate).getTime()/1000):'';
                let curString = '';
                if ((data.searchType === 'spu' || data.searchType === 'sku')&&data.searchContent) {
                    curString = data.searchContent.replace(new RegExp(' ', 'gm'), '\n');
                    data.searchContent = curString.split('\n').filter(row => !!row).map(row=>{
                        return row.trim()
                    })
                } else {
                    data.searchContent = data.searchContent.trim();
                }
                this.$set(data,'page',this.tables.page);
                this.$set(data,'pageSize',this.tables.pageSize);
                return data
            },
            size_change(val){
                this.tables.pageSize = val;
                this.init()
            },
            current_change(val){
                this.tables.page = val;
                this.init()
            },
            selection_change(val){
                this.goodsIds = val.map(row=>row.goods_id)||[];
            },
            get_enTitle(item){
                let value = [];
                if(item&&item['en']){
                    value = [...item['en'].front,...item['en'].middle,...item['en'].back];
                }
                return value.join(' ');
            },
            /*批量和单个修改标题共用*/
            submit(data){
                data.forEach(row=>{
                    let find = this.tables.lists.find(res=>Number(res.goods_id)===Number(row.goods_id));
                    if(find){
                        find.title_store = this.get_enTitle(row.titles)
                    }
                })
            },
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            batchChangeTitle:require('./batch-change-title.vue').default,
            singleEdit:require('./single-edit.vue').default,
            descDialog:require('./desc-dialog.vue').default,
        }
    }
</script>
