<template>
    <page-dialog v-model="show" size="small" title='任务转接'
                 @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <label class=" mb-mini">{{$t('ebay-list.seller')}}：</label>
        <el-input class="inline s-width-default"
                  clearable
                  @keyup.enter.native="search"
                  v-model="name" placeholder="请输入销售员名称"></el-input>
        <el-button @click="search" type="primary" size="mini">搜索</el-button>
        <el-table
            class="scroll-bar mt-sm"
            :data="owerList"
            ref="table"
            @row-click="checkRow"
            height="300"
            highlight-current-row>
            <el-table-column width="35px" inline-template>
                <el-checkbox v-model="row.isCheck" :disabled="row.disabled" @change="check_row(row)"></el-checkbox>
            </el-table-column>
            <el-table-column label="销售员" inline-template>
                <div>{{row.label}}</div>
            </el-table-column>
        </el-table>
        <!--<el-pagination-->
            <!--@size-change="size_change"-->
            <!--@current-change="current_change"-->
            <!--:current-page="page"-->
            <!--:page-sizes="[10, 20, 50, ]"-->
            <!--:page-size="pageSize"-->
            <!--layout="total, sizes, prev, pager, next, jumper"-->
            <!--:total="count">-->
        <!--</el-pagination>-->
        <div slot="footer" class="dialog-footer">
            <el-button @click="keep" size="mini" type="primary">确 认</el-button>
            <el-button size="mini" @click="close" >关 闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "change-owner",
        data(){
            return{
                page:1,
                pageSize:10,
                count:0,
                name:'',
                selectSeller:{},
                filterList:[],
                owerList:[],
                show:this.value,
            }
        },
        watch:{
            value(val){this.show=val},
            show(val){this.$emit('input',val)},
        },
        methods:{
            open(){
                this.name='';
                this.sellerList.forEach(res=>{
                    if(!(this.currentSeller instanceof Array)){
                        res.disabled=res.value===this.currentSeller.seller_id?true:false;
                    }else {
                        res.disabled=false;
                    }
                });
                this.owerList=JSON.parse(JSON.stringify(this.sellerList));

            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            close(){
                this.show=false
            },
            keep(){
                this.selectSeller=this.owerList.find(res=>{
                    return res.isCheck;
                });
                let data_=[];
                if(!(this.currentSeller instanceof Array)){
                    let data = {
                        seller_id:this.selectSeller.value,
                        id:this.currentSeller.id
                    };
                    data_.push(data)
                }else {
                    this.currentSeller.forEach(val=>{
                        let data = {
                            seller_id:this.selectSeller.value,
                            id:val.id

                        };
                      data_.push(data)
                    });
                }

                this.$emit('change-seller',data_)
            },
            checkRow(val){
                this.owerList.forEach(res=>{
                    if(res.value===val.value){
                        res.isCheck=!res.isCheck;
                    }
                });
                this.check_row(val);
            },
            check_row(row){
                this.owerList.forEach(res=>{
                    if(res.value!==row.value&&res.value!==this.currentSeller.seller_id){
                        res.disabled=row.isCheck?true:false;
                    }
                })
            },
            search(){
                if(!!this.name){
                    this.owerList=this.sellerList.filter(res=>{
                        let code = res.label.toLocaleLowerCase()
                        return code.indexOf(this.name.toLocaleLowerCase())!==-1;
                    });
                }else {
                    this.owerList=this.sellerList
                }

            },
        },
        props:{
            value:{
                type:Boolean,
                required:true
            },
            currentSeller:{

            },
            sellerList:{//销售员列表
                required:true
            }
        }
    }
</script>

<style scoped>

</style>
