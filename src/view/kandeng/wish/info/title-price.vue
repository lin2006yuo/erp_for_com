<template>
    <el-row class="p-title-price"   >
        <div class="p-titleBgcol">
            <span class="p-title-span">标题与价格</span>
        </div>
        <div class="p-titleColour-price">
            <el-form :model="form" :rules="rules" ref="formS" label-width="165px">
                <el-form-item label="账号简称：" >
                    <el-tag type="success">{{form.account_code}}</el-tag>
                </el-form-item>
                <el-form-item label="刊登标题：" prop="name">
                    <el-input v-model="form.name" style="width:850px"  class="inline"></el-input>
                    <el-button size="mini" type="primary"  @click="change_up(form)" class="inline" >单词首字母大写</el-button>
                </el-form-item>
                <el-form-item label="可售数量：" prop="inventory" required  v-if="showSpu">
                    <el-input-number size="small"
                                     v-model="form.inventory"
                                     style="width:200px"
                                     :controls="false"
                                     @change="change_inventory"
                                     :debounce="0">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="吊牌价($)：" v-if="showSpu" >
                    <ui-limit-number  v-model="form.msrp"    style="width:200px" :limit="2">
                    </ui-limit-number>
                </el-form-item>
                <el-form-item label="销售价($)："   prop="price" required  class="price" v-if="showSpu">
                    <ui-limit-number  v-model="form.price"    style="width:200px" :limit="2">
                    </ui-limit-number>
                </el-form-item>
                <div class="tag-flex mb-sm">
                    <label style="width:165px"
                           class="tag-flex-label tag-flex-asterisk">标签(
                        <span class="bold-font">
                            <span class="red">{{form.tags.length}}</span>
                            /10</span>
                        )：</label>
                    <div class="tag-flex-content">
                        <input-tag :tags="form.tags" ref="tagData" type="primary" @keydown="keydown"></input-tag>
                        <el-button type="primary"
                                   size="mini"
                                   class="inline mt-xs"
                                   :disabled="form.tags.length>=10"
                                   @click.native="extract_keyword">提取平台关键词</el-button>
                        <el-button type="primary"
                                   size="mini"
                                   class="inline mt-xs"
                                   v-if="form.tags.length>0"
                                   @click.native="copy_tags(form.tags)">复制标签</el-button>

                    </div>

                </div>
                <el-form-item label="运费($)：" v-if="showSpu" >
                    <ui-limit-number  v-model="form.shipping"    style="width:200px" :limit="2">
                    </ui-limit-number>
                </el-form-item>
                <el-form-item label="发货期：" v-if="showSpu" >
                    <div>
                        <el-input-number size="small"
                                         v-model="form.shipping_time[0]"
                                         class="inline  p-input"
                                         :controls="false"
                                         @change="change_shipping_time0"
                                         :debounce="0">
                        </el-input-number>
                        <el-input-number
                                size="small"
                                v-model="form.shipping_time[1]"
                                class="inline  p-input"
                                :controls="false"
                                @change="change_shipping_time1"
                                :debounce="0">
                        </el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="定时刊登：" v-if="isTime">
                    <el-date-picker
                            v-model="form.cron_time"
                            type="datetime"
                            placeholder="选择日期"
                            style="width: 200px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="刊登人：">
                    <span>{{form.realname}}</span>
                </el-form-item>
            </el-form>
            <extract-keyword v-model="keywordDialog"
                             :oldTags="form.tags"
                             title="选择关键词"
                             :keyword-info="keyword"
                             @keyword-clear="keywordClear"
                             @add-data="add_data"></extract-keyword>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-title-price{
      /*  .tag-flex{
            display flex;
            .tag-flex-label{
                text-align: right;
                &::before{
                    content:'*';
                    color:red;    margin-right: 4px;
                }
            }
            .tag-flex-content{
                flex: 1
            }
        }*/
        .p-input{
            display: inline-block;
            width: 50px;
        }
        .uls{
            position: absolute;
            top:26px;left:0;
            background: white;
            border:1px solid #8492a6;
            overflow-x: hidden;
            overflow-y: auto;
            width:100%;max-height:200px;z-index:999;
            li{
                text-align: center;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover{
                    background:#008BCE ;
                }
                }
        }
        .p-titleBgcol{
            background: #FAECE7;
            .p-title-span{
                color: #FFF;
                font-weight:bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                background: #FFB732;
                display: inline-block;

            }
        }
        .p-titleColour-price{
            padding: 20px;
            border-left: 3px solid #FFB732;
            .el-input--small .el-input__inner{
                height: 26px;
            }
        }
    }
</style>
<script>
    import {api_wish_channel ,api_wish_tags} from "../../../../api/kandeng"
    export default{
        data(){
            let checkNumber = (rule, value, callback) => {
                if (value===0) {
                    return callback(new Error('请输入大于0的数'));
                }else {
                    callback();
                }
            };
            return {
                keyword: '',
                keywordDialog:"",
                inputValue:"",
                uiShow:false,
                ulData:[],
                rules:{
                    name:[{ required: true, message: '请输入标题', trigger: 'blur' },],
                    inventory:[{required: true, message: '请输入数量', trigger: 'blur',type:"number"},
                        { validator: checkNumber, trigger: 'blur,change' }],
                    price:[{ validator: checkNumber, trigger: 'blur,change' }]
                },
            }
        },
        mounted(){
            this.$refs.tagData.get_focus();
        },
        computed:{
          showSpu(){
              return  this.form.variant&&this.form.variant.length===0
          }
        },
        methods:{
            copy_tags(val){
                let name = val.map(row=>{
                    return row.name;
                });
                let input = document.createElement('input');
                let body = document.getElementsByTagName('body')[0];
                input.type = 'text';
                input.value = name.join(',');
                body.appendChild(input);
                input.select();
                document.execCommand('Copy');
                body.removeChild(input);
                this.$message({type:"success",message:"复制成功！"})
            },
            add_data(val){
                val = val.map(row=>{
                    return {
                        name:row
                    }
                });
                this.form.tags = [...this.form.tags,...val];
            },
            keydown(val){
                this.keyword = val;
            },
            keywordClear(){
                this.keyword = '';
            },
            extract_keyword(){
                this.keywordDialog = true;
            },
            sumbit(){
                let flag=false;
                this.$refs.formS.validate((valid) => {
                    if (valid) {
                        flag=true
                    } else {
                        flag=false
                    }
                });
                return flag
            },
            up_first_letter(str){
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            change_up(item){
                if(!item.name){
                    return
                }
                let name= item.name.split(/\s+/);
                name= name.map(row=>{
                    row=this.up_first_letter(row)
                    return row;
                });
                item.name=name.join(' ')
            },
            change_inventory(val){
                this.form.variant.forEach(row=>{
                    row.inventory=val;
                })
            },
            change_price(val){
                this.form.variant.forEach(row=>{
                    row.price=val;
                })
            },
            change_shipping(val){
                this.form.variant.forEach(row=>{
                    row.shipping=val;
                })
            },
            change_shipping_time0(val){
                this.form.variant.forEach(row=>{
                    row.shipping_time.splice(0,1,val)
                })
            },
            change_shipping_time1(val){
                this.form.variant.forEach(row=>{
                    row.shipping_time.splice(1,1,val)
                })
            },
            change_msrp(val){
                this.form.variant.forEach(row=>{
                    row.msrp=val;
                })
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            label:{
                required:true,
                type:String
            },
            isTime:{
                default(){
                    return  true;
                }
            },
        },
        components: {
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            inputTag:require("./input-tag.vue").default,
            extractKeyword:require('./extract-keyword.vue').default,
        }
    }
</script>
