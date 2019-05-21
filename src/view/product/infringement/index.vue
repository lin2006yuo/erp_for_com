<template>
    <div class="infringement-page">
        <search :searchData="searchData" :clears="clears" :total="total" @search-data="init" :platform="platform"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="add_tort">新增</el-button>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="leading_in ">导入</el-button>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="leading_up">导出</el-button>
        </div>
        <ui-table v-loading="loading"  :element-loading-text="$t('ymx-list.playLoad')"
                  :body-height="41" :first-loading="firstLoading"
                  :has-data="tableData.length>0" v-model="checkAll"
                  :heads="[
                        {label:$t('ymx-list.image'),width:5},
                        {label:'SPU',width:7},
                        {label:$t('ymx-list.zhName'),width:10},
                        {label:$t('ymx-list.pc'),width:9},
                        {label:$t('ymx-list.activeTask'),width:5},
                        {label:$t('ymx-list.tortPlatform'),width:7},
                        {label:$t('ymx-list.infringementAccount'),width:8},
                        {label:$t('ymx-list.infringementSite'),width:6},
                        {label:$t('ymx-list.infringementDescribed'),width:12},
                        {label:$t('ymx-list.InfringementType'),width:6},
                        {label:$t('ymx-list.InfringementTime'),width:7},
                        {label:$t('ymx-list.handlers'),width:5},
                        {label:$t('ymx-list.addDate'),width:6},
                        {label:$t('ymx-list.operat'),width:7}
                        ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :key="data.id" :class="{'high-light': data.highLight}" @click="row_click(index)">
                    <!--图片-->
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="data.thumb" @click="search_img(data.thumb)" width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="mdf_img_size(data.thumb,'_200x200.', '_60x60.')" height="60px" width="60px" style="border:none" @click="search_img(data.thumb)">
                            </span>
                        </el-popover>
                    </td>
                    <!--SPU-->
                    <td>
                        <ui-tip :is-operate="true" :content="data.spu"
                                @cur-click="look(data)"></ui-tip>
                    </td>
                    <!--产品中文名-->
                    <td style="position:relative;">
                        <ui-tip  :content="data.name" ></ui-tip>
                    </td>
                    <!--所属平台-->
                    <td>
                        <ui-tip :content="data.category"></ui-tip>
                    </td>
                    <!--在售状态-->
                    <td>
                        <ui-tip v-if="data.sales_status===1" :width="98" :content="$t('ymx-list.active')"></ui-tip>
                        <ui-tip v-if="data.sales_status===2" :width="98" :content="$t('ymx-list.Inactive')"></ui-tip>
                        <ui-tip v-if="data.sales_status===3" :width="98" :content="$t('ymx-list.toBeReleased')"></ui-tip>
                        <ui-tip v-if="data.sales_status===4" :width="98" :content="$t('ymx-list.soldOut')"></ui-tip>
                        <ui-tip v-if="data.sales_status===5" :width="98" :content="$t('ymx-list.outStock')"></ui-tip>
                        <ui-tip v-if="data.sales_status===6" :width="98" :content="$t('ymx-list.partsForSale')"></ui-tip>
                    </td>
                    <!--侵权平台-->
                    <td><ui-tip :content="data.tort_channel" :width="90"></ui-tip></td>
                    <!--侵权账号-->
                    <td>
                        <ui-tip :content="data.tort_account" ></ui-tip>
                    </td>
                    <!--侵权站点-->
                    <td>
                        <ui-tip :content="data.site_code" ></ui-tip>
                    </td>
                    <!--侵权描述-->
                    <td class="ellipsis">
                        <!--<el-popover placement="left" trigger="hover" :content="data.remark" width="150" class="ellipsis">-->
                            <a slot="reference" :title="data.remark">
                                 {{data.remark}}
                            </a>
                        <!--</el-popover>-->
                    </td>
                    <!--侵权类型-->
                    <td>
                        <ui-tip :content="data.tort_type"></ui-tip>
                    </td>
                    <!--侵权时间-->
                    <td>
                        <span>{{new Date(data.tort_time).getTime()/1000 | dateFilter }}</span>
                    </td>
                    <!--操作者-->
                    <td>
                        <ui-tip :content="data.create" ></ui-tip>
                    </td>
                    <!--添加时间-->
                    <td>
                        <span>{{data.create_time | dateFilter }}</span>
                    </td>
                    <!--操作-->
                    <td class="handle">
                        <trends-select
                                type="primary"
                                 @trigger="trigger(data,$event)"
                                 :selects="selects"
                        ></trends-select>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <import-file v-model="fileDisplay"
                     :submit-url="url_tort"
                     :is-multiple="false"
                     @download-file="download_file"
                     @files-data="init"
                     @errmeaage="errmeaage"
        ></import-file>
        <err-table
            v-model="err_display"
            :datavalue="err_data"
        ></err-table>
        <export-dialog v-model="visible"></export-dialog>
        <add-diaog v-model="tort_dialog"
                   :title="title"
                   :public="public"
                   :platform="platform"
                   @close="close"
                   @addCheck="add_check"
                   @onchange="onchange"
                   @edit="edit_check"
                   :fullscreenLoading="fullscreenLoading"
                   :edit="edit"
        ></add-diaog>
        <look-edit v-model="lookVisable"
                   :edit-able='edit_able'
                   :goodsId="goodsId"
                   pageSize=50
                   currentPage=1
                   :spu="spu" ref="looks"
                   @close="init"
                   @reflash="reflash"
                   @change-data="change_data"></look-edit>
        <email-diaog
            @close="close"
            v-model="email_diaog"
            :title="email_title"
            :public="public"
        ></email-diaog>
    </div>
</template>

<style lang="stylus">
    .infringement-page{
        box-sizing:border-box;
        padding:10px;
        .handle{
            color:dodgerblue;
            span{
                cursor:pointer;
            }
        }
        .ui-table-body>table{
            table-layout: fixed;
        }
    }
</style>

<script>
    import {api_get_spu_tort_list,api_url_tort_import,api_url_tort_export,api_tort_add,api_tort_edit} from '../../../api/product';
    import {url_delete_Infringement,api_delete_Infringement} from  "../../../api/product-library";
    import {downloadFile} from '@/lib/http'
    import {api_get_channel} from '@/api/order-local';
    export default {
        data(){
            return{
                url_tort:api_url_tort_import,
                file_display:false,
                visible:false,
                total:0,
                searchData:{
                    page:1,
                    pageSize:50,
                    spu:'',
                    snType:'tort_channel',
                    snText:'',
                    tortType:'select',
                    tortText:'',
                    start_time:'',
                    end_time:'',
                    siteCode:'',
                    category:[],
                    time_type:1,
                },
                clears:{
                    page:1,
                    pageSize:50,
                    spu:'',
                    snType:'tort_channel',
                    snText:'',
                    tortType:'select',
                    tortText:'',
                    start_time:'',
                    end_time:'',
                    category:[],
                    category_id:'',
                    time_type:1,
                },
                loading: false,
                firstLoading: true,
                tableData:[],
                checkAll:false,
                goodsId:0,
                spu:'',
                edit_able:false,
                fileDisplay:false,
                typeList:'excel',
                tort_dialog:false,
                email_diaog:false,
                title:'',
                platform:[],
                public:{
                    spu:'',
                    channel_id:'',
                    site_code:'',
                    account_id:'',
                    tort_time:'',
                    tort_type:'',
                    remark:'',
                    email_content:'',
                },
                edit:false,
                fullscreenLoading:false,
                err_display:false,
                lookVisable:false,
                email_title:'',
                err_data:[],
                selects:[{label:'编辑',value:0},{label:'删除',value:1},{label:'侵权邮件',value:2}]
            }
        },
        mounted(){
            this.get_channel();
        },
        methods:{
            add_check(val,img){
                let obj=clone(val)
                obj.email_img=img.length>0?img:'';
                if(obj.tort_time instanceof Date){
                    obj.tort_time = datef("YYYY-MM-dd HH:mm:ss", obj.tort_time.getTime()/1000);
                }
                this.$http(api_tort_add,obj).then(res=>{
                  this.$message({type:"success",message:res.message});
                    this.init();
                    this.fullscreenLoading=false;
                    this.tort_dialog=false;
                }).catch(e=>{
                    this.$message({type:"error",message:e.message||e||'添加有误'})
                })
            },
            edit_check(val,img){
                let obj=clone(val);
                obj.email_img=img.length>0?img:'';
                if(obj.tort_time instanceof Date){
                    obj.tort_time = datef("YYYY-MM-dd HH:mm:ss", obj.tort_time.getTime()/1000);
                }
                let id=obj.id;
                delete obj.id;
                this.$http(api_tort_edit,id,obj).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.init();
                    this.fullscreenLoading=false;
                    this.tort_dialog=false;
                }).catch(e=>{
                    this.$message({type:"error",message:e.message||e||'编辑有误'})
                })
            },
            onchange(val){
                this.public.email_content=val;
            },
            look(val){
                this.goodsId=val.goods_id;
                this.spu=val.spu;
                this.lookVisable=true;
                console.log(val)
            },
            reflash(){

            },
            change_data(){

            },
            add_tort(){
                this.title='新增侵权纪录';
                this.edit=false;
                this.tort_dialog=true;
            },
            close() {
                this.public = {
                    spu: '',
                    channel_id: '',
                    site_code: '',
                    account_id: '',
                    tort_time: '',
                    tort_type: '',
                    remark: '',
                    email_content: '',
                }
            },
            trigger(data,val){
                switch (val.value) {
                    case 0:
                        this.public.id=data.id;
                        this.public.spu=data.spu;
                        this.public.channel_id=data.channel_id;
                        this.public.site_code=data.site_code;
                        this.public.account_id=data.account_id;
                        this.public.tort_time=data.tort_time;
                        this.public.tort_type=data.tort_type;
                        this.public.remark=data.remark;
                        this.public.email_content=data.email_content;
                        this.edit=true;
                        this.title='编辑侵权纪录';
                        this.tort_dialog=true;
                        break;
                    case 1:
                        this.delete_Infringement(data);
                        break;
                    case 2:
                        this.email_title=`SPU：${data.spu}侵权邮件内容`;
                        this.public.email_content=data.email_content;
                        this.email_diaog=true;
                        break;
                    default:
                        break;
                }
            },
            leading_in(){
                this.fileDisplay=true;
            },
            leading_up(){
                let obj=clone(this.searchData);
                if(obj.start_time instanceof Date){
                    obj.start_time = datef("YYYY-MM-dd HH:mm:ss", obj.start_time.getTime()/1000);
                }
                if(obj.end_time instanceof Date){
                    obj.end_time = datef("YYYY-MM-dd HH:mm:ss", obj.end_time.getTime()/1000);
                }
                let splitText = this.split_search(obj.spu);
                obj.category_id=obj.category.length>0?obj.category[obj.category.length-1]:'';
                delete obj.category
                obj.spu = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                    this.$http(api_url_tort_export,obj).then(res=>{
                    if(res.status===1){
                        let url = config.apiHost + `downloadFile/downExportFile?file_code=${res.file_code}`;
                        downloadFile({
                            url: url,
                            fileName:res.file_name,
                            suffix: '.xls'
                        })
                    }else if(res.status===2){
                        this.visible=true;
                    }
                }).catch(e=>{
                    this.$message({type:'error',message:e.message})
                })
            },
            download_file(){
                let url=config.apiHost+'downfile?code=tort_record';
                downloadFile({
                    url:url,
                    fileName:'侵权标准模板',
                    suffix:'.xls'
                })
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            errmeaage(val){
                if(val.result!=1){
                    this.err_data=val.message;
                    this.err_display=true;
                }else{
                    this.$message({type:'success',message:'导入成功'});
                    this.fileDisplay=false;
                }
            },
            //搜索
            init(){
                this.loading=true;
                let parameter = window.clone(this.searchData);
                let splitText = this.split_search(parameter.spu);
                if(parameter.start_time instanceof Date){
                    parameter.start_time = datef("YYYY-MM-dd HH:mm:ss", parameter.start_time.getTime()/1000);
                }
                if(parameter.end_time instanceof Date){
                    parameter.end_time = datef("YYYY-MM-dd HH:mm:ss", parameter.end_time.getTime()/1000);
                }
                parameter.spu = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                parameter.category_id=parameter.category.length>0?parameter.category[parameter.category.length-1]:'';
                delete  parameter.category;
                this.$http(api_get_spu_tort_list,parameter)
                    .then(res=>{
                        this.firstLoading = false;
                        this.tableData = [...res.data];
                        this.searchData.page = parseInt(res.page);
                        this.searchData.pageSize = parseInt(res.pageSize);
                        this.total = res.count;
                        this.loading = false;
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            },
            //图片处理
            search_img(image){
                this.imgPath = image.replace('_200x200.','_500x500.');
                this.imgDialog = true;
            },
            mdf_img_size(path,oldValue, newValue){
                return path.replace(oldValue, newValue);
            },
            row_click(){

            },
            //删除侵权记录
            delete_Infringement(obj){
                if(this.$hasPermission(url_delete_Infringement)){
                    let {id}=obj;
                    this.$confirm('是否删除该侵权记录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delete_Infringement,id)
                            .then(res=>{
                                this.init();
                            })
                            .catch(err=>{
                                this.$message({
                                    type: 'error',
                                    message: '未知错误!'
                                });
                            })
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    this.$message({
                        type:"error",
                        message:"没有删除侵权记录的权限",
                    })
                }
            },
            //处理spu搜索数据
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            get_channel(){
                this.$http(api_get_channel)
                    .then(res=>{
                        this.platform = [...res];
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            }
        },
        filters:{
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            }
        },
        components:{
            lookEdit:require("@/view/product/manager/look-edit").default,
            exportDialog:require('../goods_sku_map/export-dialog.vue').default,
            search:require('./search').default,
            uiTable:require("@/components/ui-table.vue").default,
            importFile:require("@/components/import-file.vue").default,
            addDiaog:require("./add-diaog.vue").default,
            trendsSelect:require("@/components/trends-select").default,
            emailDiaog:require('./email-diaog.vue').default,
            errTable:require('./err-table.vue').default,
        }
    }
</script>
