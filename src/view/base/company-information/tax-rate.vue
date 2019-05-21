<template>
    <el-form ref="vatInfo"
             :model="form"
             label-width="120px"
             class="c-vat-info">
        <el-row v-for="(row,index) in form.vat_data" :key="index">
            <el-form-item :label="`VAT${index!==0?index:''}：`" >
                <template v-if="(!flag||flag===2)&&edit">
                    <decimal-input class="inline width-super"
                                   :is-appear="false"
                                   :max="100" :min="0"
                                   v-model.number="row.vat">
                    </decimal-input>
                    <el-select v-model="row.code" class="width-super inline">
                        <el-option
                                v-for="item in countrySite"
                                class="width-super"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="mini" class="inline"
                               v-if="index===0" @click.native="add_vat">添加
                    </el-button>
                    <span v-else style="font-size: 20px;"
                          @click="del_vat(row,index)">
                        <i class="el-icon-delete"></i>
                    </span>
                </template>
                <template v-else>
                    <span>{{row.vat}}  {{row.code}}</span>
                </template>
            </el-form-item>
        </el-row>
        <el-row v-for="(item,it) in form.vat_attachment" :key="`${it}+key`">
            <el-form-item :label="`VAT附件${it!==0?it:''}：`">
                <el-col :span="12" >
                    <span v-if="flag===1&&!item.file.length">暂无图片</span>
                    <multi-upload :images="item.file"
                                  :label="`上传图片/PDF`"
                                  :accept="`image/jpeg,image/jpg,image/png,application/pdf`"
                                  :limit="3"
                                  :edit="((!flag||flag===2)&&edit)"
                                  @download="$emit('download',$event)"
                                  v-else
                    ></multi-upload>
                </el-col>
                <template v-if="(!flag||flag===2)&&edit">
                    <el-button type="primary" size="mini" class="inline"
                               v-if="it===0" @click.native="add_attachment">添加
                    </el-button>
                    <span v-if="form.vat_attachment.length>1" style="font-size: 20px;"
                          @click="del_attachment(item,it)">
                        <i class="el-icon-delete"></i>
                    </span>
                </template>
            </el-form-item>
        </el-row>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="(flag===2||!flag)&&!edit"
                       @click.native="edit=true"
                       type="primary">编 辑
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import decimalInput from '@/view/base/register-company/decimal-input'
    import {api_account_list} from '@/api/report-channel';
    import {api_keep_update_vat} from '@/api/company-info';
    import multiUpload from './multi-upload';
    export default {
        name: "tax-rate",
        data(){
            return {
                disabled:false,
                edit:true,
                countrySite:[],
            }
        },
        mounted(){
            this.get_country_site();
            this.edit=true;
        },
        methods: {
            get_country_site(){
                this.$http(api_account_list,{channel_id:2}).then(res=>{//亚马逊站点
                    this.countrySite=res.site;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            add_vat(){
                let obj={vat:'',code:'',type:2};
                this.form.vat_data.push(obj);
            },
            del_vat(row,index){
                this.form.vat_data.splice(index,1);
            },
            add_attachment(){
                this.form.vat_attachment.push({file:[]});
            },
            del_attachment(item,index){
                console.log(item,index,'ttt');
                this.form.vat_attachment.splice(index,1);
            },
            submit(){
                let vatArr=this.form.vat_data.filter(row=>row.vat||row.code);//可优化
                let find=vatArr.find(row=>(row.vat&&!row.code)||(!row.vat&&row.code));
                if(find)return this.$message({type:'warning',message:'VAT每条应该全部填写或全部不填写'});
                vatArr=vatArr.length?vatArr:[{vat:'',code:'',type:2}];
                let filter=this.form.vat_attachment.filter(row=>row.file.length);
                console.log(filter,'filter');
                this.$http(api_keep_update_vat,this.form.id,{
                    vat_data:vatArr,
                    vat_attachment:filter
                }).then(res=>{
                    this.$message({type:'success', message:res.message||res});
                    this.$emit('vat-update');
                    this.edit=false
                }).catch( error =>{
                    this.edit=true;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            restore(){
                if(!this.flag){
                    this.$set(this.form,'vat_data',[{vat:0,code:'',type:2}]);
                    this.$set(this.form,'vat_attachment',[{file:[]}]);
                }else {
                    this.$set(this.form,'vat_data',JSON.parse(JSON.stringify(this.originalForm.vat_data)));
                    this.$set(this.form,'vat_attachment',JSON.parse(JSON.stringify(this.originalForm.vat_attachment)));
                }
            }
        },
        props: {
            form:{},
            flag:{},
            originalForm:{}
        },
        components:{
            decimalInput,
            multiUpload
        }
    }
</script>

