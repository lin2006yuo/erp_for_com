<template>
    <el-row class="c-btnlist-middle">
        <label-items label="">
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click="add"
                        :route="apis.url_publish_add_baseinfo">
                添加商品
            </permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click="importExcelShow=true"
                        :route="apis.url_update_excel">
                导入Excel添加商品
            </permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click="updateExcelShow=true"
                        :route="apis.url_goods_import_update">
                导入Excel修改商品
            </permission>
            <permission tag="requestButton"
                        req-key="urlExport"
                        @click="export_goods"
                        :route="apis.url_export">导出小平台格式</permission>
            <permission tag="requestButton"
                        :request="batch_catch_photo"
                        :route="apis.url_batch_catch_photo">批量抓取图片</permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click.native="export_sku"
                        :route="apis.url_export_sku">商品导出</permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click.native="set_buyer"
                        :route="apis.url_goods_set_purchaser">批量修改采购员</permission>
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        @click.native="push_saihe"
                        :route="apis.url_push_irobotbox">推送赛盒</permission>
            <trends-select class="inline ml-sm mr-xs"
                           type="primary"
                           :selects="comPartAll"
                           @trigger="platform_format_export"></trends-select>
            <permission tag="requestButton"
                        :route="apis.url_get_phash"
                        req-key="repetition"
                        @click.native="check_repetition">图片查重</permission>
            <permission tag="ElButton"
                        type="primary" size="mini"
                        @click.native="distribution_push"
                        :route="apis.url_distribution_push">推送品连</permission>
            <check-repetition v-model="repetitionDialog"
                              @confirm-repetition="confirm_repetition"></check-repetition>
            <import-excel v-model="importExcelShow"
                          :api_port="apiPort" :code="code"
                          :file_name="`添加商品导入模板`"></import-excel>
            <import-excel v-model="updateExcelShow"
                          :api_port="apiPortUpdate"
                          :code="code" :file_name="`修改商品导入模板`"></import-excel>
        </label-items>
        <page-dialog title="提示" v-model="dialogVisible"  :close-on-click-modal="false">
            <categories v-model="categories_id" :tree="muiSelects" ref="categories"></categories>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="next_step" >选择并进行下一步</el-button>
                <el-button size="mini" @click.native="dialogVisible = false">取消</el-button>
            </span>
        </page-dialog>
        <add-product ref="addProduct" v-model="addVisible"></add-product>
    </el-row>
</template>
<style lang="stylus">
    .c-btnlist-middle{
        .el-button--warning{
            background: #008BCE;
            border-color:#008BCE ;
        }
        .el-button.el-button--mini.el-button--warning.el-dropdown__caret-button{
            height: 26px;
        }
        .el-upload__files{
            display: none;
        }
        .el-upload{
            width:75px;
        }
    }
</style>
<script>

    import labelItems from  '../../../components/label-items.vue'
    import pageDialog from  "../../../components/page-dialog.vue"
    import  addProduct from  './add-product.vue'
    import {api_get_categories} from   '../../../api/categories';
    import{url_publish_add_baseinfo,url_update_excel,url_goods_import_update,
        url_export,url_batch_catch_photo,url_goods_set_purchaser,
        url_push_irobotbox,url_download_shopee,url_export_sku,url_distribution_push,
        url_download_discount,url_download_walmart,url_download_lazada,url_get_phash,url_export_noon} from "../../../api/product-library"
    import {api_update_excel, api_goods_import_update,api_export,api_batch_catch_photo,api_push_irobotbox,api_get_phash} from '../../../api/product-library'
    export default{
        permission:{
            url_download_shopee,
            url_publish_add_baseinfo,
            url_update_excel,
            url_goods_import_update,
            url_export,
            url_batch_catch_photo,
            url_goods_set_purchaser,
            url_push_irobotbox,
            url_export_sku,
            url_download_discount,
            url_download_walmart,
            url_download_lazada,
            url_get_phash,
            url_export_noon,
            url_distribution_push
        },
        data(){
            return {
                categories_id:'',
                apiPort:api_update_excel,
                apiPortUpdate:api_goods_import_update,
                code:'goods',
                dialogVisible:false,
                muiSelects:{},
                addVisible:false,
                excelVisible:false,
                importExcelShow:false,
                updateExcelShow:false,
                hiden:false,
                form:{
                    operationV:"",
                    operationList:[
                        {label:"批量操作",value:"batch"},
                    ]
                },
                repetitionDialog:false,
                partAllOptions:[
                    {name:'Shopee格式导出',value:'shopee',apis:url_download_shopee},
                    {name:'Cdiscount格式导出',value:'cdiscount',apis:url_download_discount},
                    {name:'Walmart格式导出',value:'walmart',apis:url_download_walmart},
                    {name:'Lazada格式导出',value:'lazada',apis:url_download_lazada},
                    {name:'NOON格式导出',value:'noon',apis:url_export_noon},
                ]
            }
        },
        mounted(){
            this.$http(api_get_categories).then(date=>{
                this.muiSelects=date;
            }).catch(code=>{
                console.log(`错误代码${code}`)
            });

        },
        methods:{
            check_repetition(){
                this.repetitionDialog = true;
            },
            distribution_push(){
                this.$emit('distribution-push');
            },
            confirm_repetition(val){
                this.$reqKey('repetition',false);
                this.$emit('confirm-repetition',val)
            },
            push_saihe(){
                if(this.ids.length<=0)return this.$message({type:"warning",message:'请选择要推送至赛盒的商品'});
                this.$http(api_push_irobotbox,{ids:this.ids}).then(res => {
                    this.$message({type:"success",message:res.message||res});
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code});
                })

            },
            set_buyer(){
                if(this.ids.length<=0)return this.$message({type:'warning',message:'请选择需要批量修改的数据'});
                this.$emit('set-buyer');
            },
            batch_catch_photo(){
                if(this.ids.length<=0)return this.$message({type:"warning",message:"请选择批量操作的数据！"});
                return this.$http(api_batch_catch_photo,{ids:this.ids}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
                return Promise.resolve();
            },
            add(){
                this.dialogVisible = true;
            },
            next_step(){
                this.dialogVisible = false;
                if(!this.muiSelects[this.categories_id]){
                    this.categories_id='';
                    return "";
                }
                let name=this.$refs.categories.label;
                this.$refs.addProduct.baseData[0].category=name;
                this.$refs.addProduct.baseData[0].category_id= this.categories_id;
                this.addVisible=true;
                this.categories_id='';
            },
            platform_format_export(val){
                console.log(val,'val');
                this.$emit('platform-format-export',val)
            },
            export_goods(){
                this.$emit("export-goods");
            },
            export_sku(){
                this.$emit("export-sku");
            },
        },
        computed:{
            comPartAll(){
                return this.partAllOptions.filter(row=>this.$hasPermission(row.apis));
            }
        },
        watch:{
          value(val){
                this.hiden=val;
          },
            hiden(val){
              this.$emit('input',val)
            }
        },
        props:{
          value:{},
          ids:{},
        },
        components: {
            labelItems,
            pageDialog,
            addProduct,
            importExcel:require('../excel-update/import-excel.vue').default,
            categories:require("./categories.vue").default,
            requestButton:require('@/global-components/request-button.vue').default,
            checkRepetition:require('./check-repetition.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>

