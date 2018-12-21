<template>
    <el-row class="p-add-supplier">
        <page-dialog title="选择供应商" v-model="supplierBox" size="small" @change="closeDialog" :close-on-click-modal="false">
          <!--  <div class="search-box">
                <i class="el-icon-search"></i>
                <el-input v-model="snText" style="display: inline-block;"></el-input>
                <el-button type="primary" size="mini" @click="search">模糊搜索</el-button>
            </div>-->
            <div style="height: 300px;overflow-y: auto;">
                <table class="template">
                    <tr class="line" style="font-weight:bold">
                        <th width="44px"></th>
                        <th>供应商名称</th>
                        <th>报价</th>
                        <th>最小值</th>
                        <th>最大值</th>
                        <th >联系人</th>
                        <th >联系电话</th>
                        <th >Email</th>
                    </tr>
                    <tbody>
                        <tr v-if="supplierData.length==0">
                            <td :colspan="6">暂无数据！</td>
                        </tr>
                        <tr  v-for="(data, index) in supplierData">
                            <td>
                                <el-radio class="radio" v-model="radio" :label="data.id">
                                    <span></span>
                                </el-radio>
                                <!--<el-checkbox v-model="data.isCheck" @change="change(data)"></el-checkbox>-->
                            </td>
                            <td>
                                <ui-tips  :content="data.company_name"></ui-tips>
                            </td>
                            <!--报价-->
                            <td>
                                <ui-tips :content="data.price"></ui-tips>
                            </td>
                            <!--最小值-->
                            <td>
                                <ui-tips :content="data.min_quantity"></ui-tips>
                            </td>
                            <!--最大值-->
                            <td>
                                <ui-tips :content="data.max_quantity"></ui-tips>
                            </td>
                            <td>{{data.contacts}}</td>
                            <td>
                                <ui-tips  :content="data.tel"></ui-tips>
                            </td>
                            <td>
                                <ui-tips  :content="data.email"></ui-tips>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit">确定</el-button>
                <el-button size="mini" @click.native="supplierBox=false">取 消</el-button>
            </div>
        </page-dialog>

    </el-row>
</template>
<style lang="stylus">
    .p-add-supplier{
        .search-box{
            position: relative;
            margin-bottom: 5px;
            .el-icon-search{
                position: absolute;
                top:8px;
                left: 5px;
                z-index: 1999;
            }
            .el-input__inner{
                width: 300px;
                padding: 3px 16px;
            }
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {getSupplier} from '../../../api/purchasing'
    export default{
        page:{
            devinfo:{
                frontEnd:'徐梦娇;黎宏珍',
                backEnd:'',
                createTime:'2017-1-12',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return {
                snText:'',
                supplierBox:false,
                checkSupplier:[],
                radio:''
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
           /* search(){
                if(this.snText){
                    let data={
                        content:this.snText
                    };
                    this.$http(getSupplier,data).then(res=>{
                        console.log(res);
                        this.supplierData=res.data;
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                }
            },*/
            submit(){
                if(this.checkSupplier.length>0){
                    this.supplierBox=false;
                    this.$emit('update_supplier',this.checkSupplier)
                }
            },
           /* change(val){
               this.supplierData.forEach(data=>{
                    this.$set(data,'isCheck',false)
                })
                val.isCheck=true;
               console.log(val);
            },*/
            closeDialog(val){
                if(val){
                 /*   this.supplierData=[];*/
                    this.checkSupplier=[];
                    this.snText='';
                    this.radio=''
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.supplierBox=val;
            },
            supplierBox(val){
                this.$emit('input',val)
            },
            radio(val){
                this.checkSupplier=[];
                this.checkSupplier.push(this.supplierData.find(data=>data.id===val))
            },
        },
        computed: {},
        props: {
            value:{},
            supplierData:{},
        },
        components: {
            pageDialog,
            uiTips:require('../../../components/ui-tips.vue').default
        }
    }
</script>
