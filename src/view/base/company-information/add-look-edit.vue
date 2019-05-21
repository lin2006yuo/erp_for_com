<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="65%"
                 :close-on-click-modal="false"
                 @change="open_dialog"
                 class="c-company-info-dialog">
        <el-tabs v-model="activeName"
                 type="card"
                 @tab-click="tab_click_item">
            <el-tab-pane v-for="item in showCurrentTabs"
                         :label="item.label"
                         :name="item.name"
                         :key="item.id">
                <component :is="item.comp"
                           ref="comp"
                           :form="form"
                           :channels="channels"
                           :flag="flag"
                           :original-form="originalForm"
                           :channelData="channelData"
                           @company="keep_company_info"
                           @vat-update="vat_update"
                @download="download">
                </component>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini"
                       @click.native="close">关闭
            </el-button>
        </div>
    </page-dialog>
</template>

<script>
    import companyInfo from './company-info';
    import datef from 'datef';
    import taxRate from './tax-rate';
    import operationLog from './operation-log';
    import {get_channel,look_at_operation_log,} from './action';
    import {downloadFile} from '@/lib/http';
    export default {
        name: "add-look-edit",
        data() {
            return {
                show:this.value,
                activeName:'companyInfo',
                tabs:[
                    {id:1,label:"公司信息",name:"companyInfo",comp:companyInfo,isView:false},
                    {id:3,label:"VAT",name:"taxRate",comp:taxRate,isView:false},
                    {id:4,label:"操作日志",name:"operationLog",comp:operationLog,isView:false},
                ],
                channels:[],
                channelData:[],
                originalForm:{}
            }
        },
        computed: {
            showCurrentTabs(){
                return this.tabs.filter(tab=>tab.isView);
            }
        },
        watch: {
            show(val){
                this.$emit('input',val)
            },
            value(val){
                this.show=val;
            },
            channels:{
                deep:true,
                handler(val){
                    if(!!this.flag){
                        this.channelData=[];
                        if(this.form.channel===0){
                            this.channelData=val.map(row=>row.label);
                        }else{
                            if(({}.toString.call(this.form.channel))==='[object Array]'){
                                val.forEach(row=>{
                                    this.form.channel.forEach(num=>{
                                        if(Number(num)===row.value){
                                            this.channelData.push(row.label);
                                        }
                                    })
                                })
                            }
                        }
                    }
                }
            },
            form:{
                deep:true,
                handler(val){
                    this.$set(val,'business_end',val.business_term_nd?datef('YYYY-MM-dd',val.business_term_nd):'长期有效');
                    this.$set(val,'ID_end',val.id_date_nd?datef('YYYY-MM-dd',val.id_date_nd):'长期有效');
                }
            }
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.activeName='companyInfo';
                    this.originalForm={};
                    this.channelData=[];
                    get_channel(this);
                    if(!this.flag){//add
                        this.tabs.forEach(row=>{
                            this.$set(row,'isView',false);
                        });
                        this.tabs[0].isView=true;
                    }else{// look over and edit
                        this.tabs.forEach(row=>{
                            this.$set(row,'isView',true);
                        });
                        this.originalForm=JSON.parse(JSON.stringify(this.form))
                    }
                }
            },
            tab_click_item(tab,event){
                if(tab.name==='operationLog'){
                    look_at_operation_log(this,this.form.id);
                }
            },
            keep_company_info(data){
                this.$set(this.form,'type_name',data.type_name);
                this.$set(this.form,'source_name',data.source_name);
                this.$set(this.form,'business_end',data.business_term_nd?datef('YYYY-MM-dd',data.business_term_nd*1000):'长期有效');
                this.$set(this.form,'Id_end',data.id_date_nd?datef('YYYY-MM-dd',data.id_date_nd*1000):'长期有效');
                if(!this.form.id){
                    this.$set(this.form,'id',data.id);
                    this.$set(this.tabs[1],'isView',true);
                    this.activeName='taxRate';
                    look_at_operation_log(this,this.form.id);
                    this.$set(this.tabs[2],'isView',true);
                }
            },
            download(img){
                let index=img.path.indexOf('/upload');
                if(index!==-1){
                    let path=img.path.substring(index,img.path.length);
                    downloadFile({
                        url:`${config.apiHost}supplier/download-image`,
                        get: {file: path},
                        fileName: path.slice(path.lastIndexOf('/')-1,path.lastIndexOf('.')),
                        suffix: path.slice(path.lastIndexOf('.'))
                    });
                }else{
                    this.$message({type:'warning',message:'文件未上传，无法下载'})
                }
            },
            vat_update(){
                if(!this.id){
                    this.close();
                }
            },
            close(){
                this.show=false;
                this.$emit('refresh');
            },
        },
        props: {
            value:{},
            title:{},
            flag:{//0 add  1 look over  2 edit
                type:Number
            },
            id:{},
            form:{}
        },
        components: {
            companyInfo,
            taxRate,operationLog
        },
    }
</script>

