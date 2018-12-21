<template>
    <rainbow-header :title="$t('ymx-detail.titleDes')">
        <el-tabs v-model="form.skuActiveName" class="relative">
            <el-tab-pane v-for="(row,index) in form.descript"
                         :label="index===0?'父SKU_'+row.skuName:row.skuName"
                         :name="`${row.skuName}-${index}`"
                         :key="`${row.skuName}-${index}`">
                <el-form :model="row" :label-width="labelWidth">
                    <template v-for="(item,i) in row.field">
                        <template v-if="item.select === 0">
                            <el-form-item v-if="item.key==='Title'"
                                          :prop="`field[${i}].value`"
                                          :rules="{required: item.require === 1, message:$t('ymx-detail.req'), trigger:'blur'}"
                                          :label="`${item.name}：`" >
                                <limit-input v-model="item.value"
                                             style="width:900px"
                                             class="inline"
                                             :is-textarea="false"
                                             :maxlength="item.maxLength"
                                             :cur-span="23"
                                             :show-number="true"
                                             @blur-change="blur_change(row,index,i)"></limit-input>
                                <el-button style="margin-left: 30px;" type="primary" size="mini"
                                           @click="initial_uppercase(row,i)">{{$t('ymx-detail.upperCase')}}
                                </el-button>
                            </el-form-item>
                            <template v-else-if="item.value instanceof Array"
                                      v-for="(it,t) in item.value">
                                <el-form-item :prop="`field[${i}].value[${t}]}`"
                                              :label="t===0?`${item.name}：`:''"
                                              :rules="{required: item.require === 1, message:$t('ymx-detail.req'), trigger:'blur'}">
                                    <limit-input v-model="item.value[t]"
                                                 style="width:900px"
                                                 class="inline"
                                                 :is-textarea="false"
                                                 :maxlength="item.maxLength"
                                                 :cur-span="23"
                                                 :show-number="true"
                                                 @blur-change="blur_change(row,index,i,t)"></limit-input>
                                </el-form-item>
                            </template>
                            <el-row v-else-if='item.key==="Description"'>
                                <el-col :span="4"  style="text-align:right">
                                    <label>{{$t('ymx-detail.desc')}} <b>（<span :class="[item.value&&item.value.length>item.maxLength?'red':'color-success']">{{item.value.length}}</span>/{{item.maxLength}}）</b>：</label>
                                </el-col>
                                <el-col :span="18">
                                    <simditor v-model="item.value"
                                              ref="uEditor"
                                              @value-changed="content_change(index,i,$event)"
                                              :editorId='return_id(row,index)'></simditor>
                                    <div v-if="exceedMaxLength" class="mt-sm" style="font-size:1.25rem">
                                        <b class="red">注意：子SKU数量已 ≥25 条，将父SKU内容应用到所有子SKU的操作，需<span v-if="index!==0">在父SKU页面</span>手动点击'应用到子SKU'按钮！</b>
                                        <el-button type="danger" size="mini" v-if="index===0" :mintime="300" :disabled="isDisabled" @click.native="apply_sku">{$t('ymx-detail.applySku')}}</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-form-item v-else-if="item.key!=='SKU'" :prop="`field[${i}].value`"
                                          :rules="{required: item.require === 1, message:$t('ymx-detail.req'), trigger:'blur'}"
                                          :label="`${item.name}：`" >
                                <limit-input v-model="item.value"
                                             style="width:900px"
                                             class="inline"
                                             :is-textarea="false"
                                             :maxlength="item.maxLength"
                                             :cur-span="23"
                                             :show-number="true"
                                             @blur-change="blur_change(row,index,i)"></limit-input>
                            </el-form-item>
                        </template>
                    </template>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </rainbow-header>
</template>
<style lang="stylus">
    .fixed_btn{
        position:absolute;
        top:0;
        right:0;
        z-index:999
    }
    .simditor{
        .simditor-wrapper{
            .simditor-body{
                max-height:500px;
                overflow:auto;
                p{
                    font-size:16px;
                }
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                toolbars:[
                    ['source','bold']
                ],
                backgroundColor:'',
                isDisabled:false,
            }
        },
        computed:{
            edit(){
                return String(this.editId);
            },
            exceedMaxLength(){
                // form.descript包含一条父sku；故此length要>=26
                return this.form.descript.length>=26
            },
        },
        methods:{
            return_id(row,index){
                if(this.showSite){
                    return `${this.curPage}-${row.skuName}${index}-${this.form.siteId}`
                }else{
                    return `${this.curPage}-${row.skuName}${index}-${this.form.code}-${this.form.goods_id}`;
                }
            },
            get_length(item){
                if(!item)return;
            },
            apply_sku(){
                this.isDisabled = true;
                setTimeout(()=>{
                    let row = this.form.descript[0].field;
                    let dec = row.find(item=>item.name==='Description');
                    this.form.descript.forEach((res,index)=>{
                        if(index!==0){
                            res.field.forEach((item,it)=>{
                                let fieldVlaue = row[it].value;
                                if(item.value instanceof Array){
                                    this.$set(item,'value',clone(fieldVlaue));
                                }else{
                                    this.$set(item,'value',fieldVlaue);
                                }
                            });
//                            res.field = clone(row);
                            this.$refs.uEditor[index].editor.setValue(dec.value);
                        }
                    });
                    this.$message({type:'success',message: this.$t('ymx-detail.applicate')});
                    this.isDisabled = false;
                },0);
            },
            content_change(index,i,val){
                if(index!==0||this.exceedMaxLength)return;
                this.form.descript.forEach((res,res_i)=>{
                    if(res_i!==index){
                        this.$set(res.field[i],'value',val);
                        this.$refs.uEditor[res_i].editor.setValue(val);
                    }
                });
            },
            blur_change(row,index,i,t){
                if(index!==0||this.exceedMaxLength)return;
                let content = row.field[i].value instanceof Array?row.field[i].value[t]:row.field[i].value;//value值
                this.form.descript.forEach((res,res_i)=>{
                    if(res_i!==index){
                        if(res.field[i].value instanceof Array){
                            res.field[i].value[t] =  content;
                        }else{
                            this.$set(res.field[i],'value',content);
                        }
                    }
                })
            },
            initial_uppercase(row,index){
                if(!row.field[index].value) return this.$message({message: this.$t('ymx-detail.enterTitle'), type:'warning'});
                let name= row.field[index].value.split(/\s+/);
                name = name.map(row=>{
                    row=this.up_first_letter(row);
                    return row;
                });
                row.field[index].value = name.join(' ');
            },
            up_first_letter(str){
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
        },
        props:{
            form:{
                required:true,
                type:Object,
            },
            editId:{},
            curPage:{/*判断是从哪个模块进入的*/},
            labelWidth:{
                type:String,
            },
            /*由于范本刊登详情页面和Amazon刊登详情页面有所不同，故使用此字段进行区分*/
            showSite:{
                type:Boolean,
            }
        },
        components: {
            rainbowHeader:require('../../../../components/rainbow-header.vue').default,
            limitInput: require('../../ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            simditor:require('../../../../components/simditor').default,
        }
    }
</script>