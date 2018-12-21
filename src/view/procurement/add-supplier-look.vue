<template>
    <el-row class="p-add-supplier">
        <page-dialog title="查看报价" v-model="supplierBox" size="full" @change="closeDialog" :close-on-click-modal="false">
            <div style="height: 300px;overflow-y: auto;">
                <table class="template">
                    <tr class="line" style="font-weight:bold">
                        <!--<th width="44px"></th>-->
                        <th>供应商名称</th>
                        <th width="80">价格（￥）</th>
                        <th width="80">报价（￥）</th>
                        <th width="80">件数</th>
                        <th >联系人</th>
                        <th >联系电话</th>
                        <th >Email</th>
                    </tr>
                    <tbody>
                        <tr v-if="supplierData.length==0">
                            <td :colspan="7">暂无数据！</td>
                        </tr>
                        <tr  v-for="(data, index) in supplierData" :key="index" v-if="data.status===1">
                            <!--<td>-->
                                <!--<el-radio class="radio" v-model="radio" :label="data.id">-->
                                    <!--<span></span>-->
                                <!--</el-radio>-->
                                <!--&lt;!&ndash;<el-checkbox v-model="data.isCheck" @change="change(data)"></el-checkbox>&ndash;&gt;-->
                            <!--</td>-->
                            <td>
                                <ui-tips :content="data.company_name"></ui-tips>
                            </td>
                            <!--价格-->
                            <td>
                                <ui-tips :content="data.price"></ui-tips>
                            </td>
                            <!--报价-->
                            <td>
                                <p v-for="item in data.section">
                                    {{item.price}}
                                </p>
                            </td>
                            <!--最小值-->
                            <td>
                                <!--<ui-tips :content="data.min_quantity"></ui-tips>-->
                                <p v-for="item in data.section">
                                    {{item.min_quantity}}{{item.max_quantity === "" ? "件以上":"-" + item.max_quantity}}
                                </p>
                            </td>
                            <!--最大值-->
                            <!--<td>-->
                                <!--<ui-tips :content="data.max_quantity"></ui-tips>-->
                            <!--</td>-->
                            <td>{{data.contacts}}</td>
                            <td width="150px">
                                <ui-tips  :content="data.tel"></ui-tips>
                            </td>
                            <td width="150px">
                                <ui-tips  :content="data.email"></ui-tips>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <!--<el-button size="mini" type="primary" @click="submit">确定</el-button>-->
                <el-button size="mini" @click.native="supplierBox=false">关闭</el-button>
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
    import pageDialog from '../../components/page-dialog.vue'
    import {getSupplier} from '../../api/purchasing'
    export default{
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
        filters: {
            hasMax(row){
                if(row){
                    return "件以上";
                }else{
                    return `-${row}`;
                }
            }
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
        computed: {

        },
        props: {
            value:{},
            supplierData:{},
        },
        components: {
            pageDialog,
            uiTips:require('../../components/ui-tips.vue').default
        }
    }
</script>
