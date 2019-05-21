<template>
    <el-row class="c-base-info">
        <!--<card label="产品信息">-->
            <!--TODO 上传图片-->
            <el-form :model="baseData" label-width="135px" :rules="rules" ref="base">
                <el-form-item label="本地分类："  required>
                    <span>{{baseData.category}}</span>
                    <el-button size="mini" type="primary" @click.native="dialogVisible=true" v-if="!editAble"
                               :disabled="isShow">编辑
                    </el-button>
                    <page-dialog title="提示" v-model="dialogVisible" :close-on-click-modal="false">
                        <categories v-model="baseData.category_id" :tree="muiSelects" ref="categories"></categories>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini" @click.native="next_step"  type="primary"
                                       :disabled="!selectLast">选择并进行下一步</el-button>
                            <el-button size="mini"  @click.native="dialogVisible = false">取消</el-button>
                        </span>
                    </page-dialog>
                </el-form-item>
                <el-form-item label="产品名称：" class="changeW" required prop="name">
                    <ui-input :edit="!editAble" v-model="baseData.name" class="inline"></ui-input>
                </el-form-item>
                <el-form-item label="SPU：" class="changeW">
                    <span>系统自动生成</span>
                    <!--<ui-input :edit="!editAble" v-model="baseData.spu" class="inline"></ui-input>-->
                </el-form-item>
                <el-form-item label="品牌：" class="changeW" required   prop="brand_id" >
                    <select-text class="pri-width" v-model="baseData.brand_id"  >
                        <el-option v-for="brand in unitData[1].brand" :key="brand.id" :label="brand.name" :value="brand.id"></el-option>
                    </select-text>
                </el-form-item>
                <el-form-item label="产品侵权风险：" required  prop="tort_id">
                    <el-col :span="10">
                        <select-text class="inline pri-width" v-model="baseData.tort_id">
                            <el-option v-for="tort in unitData[4].tort" :key="tort.id" :label="tort.name" :value="tort.id"></el-option>
                        </select-text>
                    </el-col>
                </el-form-item>
              <el-form-item label="产品最低限价：" required  prop="retail_price">
                  <ui-input :edit="!editAble" v-model="baseData.retail_price" class="inline"></ui-input>
              </el-form-item>
                <!--产品标签隐藏-->
                <!--<el-form-item label="产品标签：">-->
                    <!--<el-checkbox v-model="item.ischeck" v-for="item  in  unitData[2].tag">{{item.name}}</el-checkbox>-->
                <!--</el-form-item>-->
                <el-form-item label="产品物流属性：" required>
                    <el-checkbox v-model="item.enabled"
                                 v-for="item  in  unitData[8].property"
                                 :key="item.name">{{item.name}}
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="商品中文报关名称：">
                    <el-col :span="5">
                        <ui-input :edit="!editAble" v-model="baseData.declare_name" class="inline"></ui-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品英文报关名称：">
                    <el-col :span="5">
                        <ui-input :edit="!editAble" v-model="baseData.declare_en_name" class="inline"
                                  @input="change_english"></ui-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="海关编码(HS Code)：">
                    <ui-input :edit="!editAble" v-model="baseData.hs_code" class="inline"></ui-input>
                </el-form-item>
                <el-form-item label="开发员：" >
                    <select-text :edit="!editAble"  v-model="baseData.developer_id"  class="pri-width"  :filterabl="true" >
                        <el-option v-for="item in development" :key="item.id" :label="item.realname" :value="item.id"></el-option>
                    </select-text>
                </el-form-item>
                <el-form-item label="商品尺寸：" class="input-box">
                    <label>长：</label>
                    <ui-limit-number  class="inline width-xs" v-if="!editAble" :disabled="isShow" v-model="baseData.depth" :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">宽：</label>
                    <ui-limit-number  class="inline width-xs"  v-if="!editAble" :disabled="isShow" v-model="baseData.width" :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">高：</label>
                    <ui-limit-number  class="inline width-xs" v-if="!editAble" :disabled="isShow" v-model="baseData.height" :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">体积重：</label>
                    <span v-if="editAble" class="inline min-width">{{volume}}</span>
                    <el-input v-if="!editAble" class="inline min-width " v-model="volume" type="number"
                              disabled></el-input>
                    <label>g</label>
                </el-form-item>
                <el-form-item label="产品净重：" class="input-box" required   prop="weight" >
                    <ui-limit-number  class="inline width-xs " v-if="!editAble" @blur="weight_blur"
                                      v-model="baseData.weight" :limit="1" ref="weight">
                    </ui-limit-number>
                    <span class='operate' v-else>{{baseData.weight}}</span>
                    <!--<ui-input :edit="!editAble" v-model="baseData.weight" class="inline"></ui-input>-->
                    <label>g</label>
                </el-form-item>
                <el-form-item label="产品毛重：" class="input-box"  required   prop="net_weight"  >
                    <ui-limit-number  class="inline width-xs " v-if="!editAble" @blur="net_weight_blur"
                                      v-model="baseData.net_weight" :limit="1" ref="net_weight">
                    </ui-limit-number>
                    <span class='operate' v-else>{{baseData.net_weight}}</span>
                    <!--<ui-input :edit="!editAble" v-model="baseData.weight" class="inline"></ui-input>-->
                    <label>g</label>
                </el-form-item>
                <el-form-item label="是否含包装："  required prop="is_packing">
                    <select-text :edit="!editAble" v-model="baseData.is_packing" class="pri-width">
                        <el-option v-for="item in wapper" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </select-text>
                </el-form-item>
                <el-form-item label="包装材料："  required prop="packing_id">
                    <span> {{baseData.package}} </span>
                    <select-text class="pri-width" v-model="baseData.packing_id">
                        <el-option v-for="packing in  unitData[3].packing" :key="packing.id" :label="packing.name"
                                   :value="packing.id"></el-option>
                    </select-text>
                </el-form-item>
                <el-form-item label="产品单位："  required prop="unit_id">
                    <select-text class="pri-width" v-model="baseData.unit_id">
                        <el-option v-for="unit in unitData[0].unit" :key="unit.id" :label="unit.name" :value="unit.id"></el-option>
                    </select-text>
                </el-form-item>

                <el-form-item label="默认仓库：" required prop="warehouse_id">
                    <select-text class="pri-width" v-model="baseData.warehouse_id">
                        <el-option v-for="unit in unitData[6].depot" :key="unit.id" :label="unit.name" :value="unit.id"></el-option>
                    </select-text>
                </el-form-item>
                <el-form-item label="是否存在于多仓库："   required prop="is_multi_warehouse">
                    <select-text :edit="!editAble" v-model="baseData.is_multi_warehouse" class="pri-width">
                        <el-option v-for="item in multi" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </select-text>
                </el-form-item>

                <el-form-item label="销售平台状态：">
                    <table class="template" v-if="editAble">
                        <tr>
                            <th v-for="item in baseData.platform_sale" :key="item.name">
                                {{item.name}}
                            </th>
                        </tr>
                        <tr>
                            <td v-for="item in baseData.platform_sale" :key="item.name">
                                {{item.value}}
                            </td>
                        </tr>
                    </table>
                    <table class="template" v-if="!editAble">
                        <tr>
                            <th v-for="item in baseData.platform_sale" :key="item.name">
                                {{item.name}}
                            </th>
                        </tr>
                        <tr>
                            <td v-for="rem in baseData.platform_sale" :key="rem.value_id">
                                <select-text class="pri-width" v-model="rem.value_id" :disabled="isShow"
                                           style="width:100px">
                                    <el-option v-for="unit in unitData[7].plat"
                                               :label="unit.name"
                                               :key="unit.id"
                                               :value="unit.id"></el-option>
                                </select-text>
                            </td>
                        </tr>
                    </table>

                </el-form-item>
                <el-form-item label="参考网站链接：">
                    <div v-if="editAble" v-for="(url,i) in baseData.source_url" :key="i">
                        <div class="mt-xs"><span
                                style="width:300px;line-height: 26px;display: inline-block;">{{url}}</span>
                            <el-button size="mini" type="success" @click="open_link(url)">打开链接</el-button>
                        </div>
                    </div>

                    <div v-if="!editAble" v-for="(urls,index) in baseData.source_url" :key="index">
                        <div>
                            <el-input style="width:300px" class="inline"
                                      v-model="baseData.source_url[index]"></el-input>
                            <el-button size="mini" type="success" @click="open_link(urls)">打开链接</el-button>
                            <el-button size="mini" type="danger" class="el-icon-delete"
                                       v-show="baseData.source_url.length>1" @click="del_link(index)"
                                       :disabled="isShow"></el-button>
                        </div>
                    </div>
                    <div v-if="!editAble">
                        <el-button size="mini" @click.native="add_link" type="primary" :disabled="isShow" class="mt-xs">
                            添加链接
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        <!--</card>-->
    </el-row>
</template>
<style lang="stylus">
    .c-base-info {
        .pri-width {
            width: 172px;

        }
        .changeW { //改变input margin-right
            margin-right: 335px;
        }
        .info-upload {
            position: absolute;
            top: 50px;
            right: 50px;
            .el-dragger {
                width: 100px;
                height: 100px;
            }
        }
        .input-box {
            label {
                color: #1f2d3d;
            }
            .min-width {
                width: 70px;
            }
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import erpLabel from '../../../components/erp-label';
    import  uiInput from  '../../../components/ui-input.vue'
    import muiSelect from '../../../components/mui-select.vue';
    import {api_get_categories} from   '../../../api/categories';
    import pageDialog from  "../../../components/page-dialog.vue";
    import {plus,url,chinese,integer} from '../../../define/validator_reg';
    import{api_development} from "../../../api/product-library"
    export default{
        data(){
            let plusNumber = (rule,value,callback)=>{
                if(value){
                    return !plus.test(value)?callback(new Error("请输入正数数字")):callback();
                }else{
                    callback();
                }
            };
            let check = (rule, value, callback) => {
                setTimeout(() => {
                    if (!value) {
                        callback(new Error('请选择产品风险！'));
                    }else{
                        callback();
                    }
                }, 1000);
            };
            let net_weight=(rule, value, callback)=>{
                    let val=Number(value);
                let baseweight=Number(this.baseData.weight);
                        if(val&&baseweight&&val>=baseweight){
                            callback();
                        }else {
                            callback(new Error('毛重应大于净重'));
                        }
            }
            let   weight=(rule, value, callback)=>{
                let val=Number(value);
                let basenetweight=Number(this.baseData.net_weight);
                if(val&&basenetweight&&val<basenetweight){
                    callback();
                }else {
                    callback(new Error('净重应小于毛重'));
                }
            }
            return {
                dialogVisible: false,
                development:[],
                multi: [
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                wapper: [
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                tags: [],
                classify: 0,
                muiSelects: {},
                rules: {
                    name: [
                        {required: true, message: '请输入产品名称', trigger: 'blur'},
                    ],
                    tort_id: [
                        {required: true, message: '请选择产品风险', trigger: 'blur', type: "number"},
                        { validator: check, trigger: 'change' }
                    ],
                    brand_id:[ {required:true,message:'请选择产品风险',trigger:'blur,change',type:"number"}],
                    retail_price: [
                        {required: true, message: '请输入零售价', trigger: 'blur'},
                        {validator: plusNumber,trigger:'blur'}
                    ],
                    warehouse_id: [
                        {required: true, message: '请选择默认仓库', trigger: 'blur', type: "number"},
                        { validator: check, trigger: 'change' }
                    ],
                    net_weight:[{required: true, message: '请输入产品毛重', trigger: 'blur,change'},
                        { validator: net_weight, trigger: 'change,blur' }],
                    weight:[{required: true, message: '请输入产品净重', trigger: 'blur,change'},
//                        { validator:weight, trigger: 'change,blur' }
                    ],
                    is_packing:[ {required:true,message:'请选择是否包装',trigger:'blur,change',type:"number"}],
                    packing_id:[ {required:true,message:'请选择包装材料',trigger:'blur,change',type:"number"}],
                    unit_id:[ {required:true,message:'请选择产品单位',trigger:'blur,change',type:"number"}],
                    is_multi_warehouse:[ {required:true,message:'请选择是否多仓库',trigger:'blur,change',type:"number"}],
                },
            }
        },
        mounted(){
            this.$http(api_get_categories).then(date=> {
                this.muiSelects = date;
            }).catch(code=> {
                console.log(`错误代码${code}`)
            });
            this.get_developer();
        },
        wacth: {},
        filters: {},
        computed: {
            volume(){
                return (this.baseData.depth * this.baseData.width * this.baseData.height / 6).toFixed(2)
            },
            dis(){
                if (this.editAble || this.isShow) {
                    return true
                } else {
                    return false
                }
            },
            selectLast(){
                return true;
            },

        },
        methods: {
            weight_blur(){

            },
            net_weight_blur(){
                this.$refs.weight.$refs.input.handleBlur()
            },
            get_developer(){
                this.$http(api_development).then(res=>{
                    this.development=res
                }).catch(code=>{
                    console.log(code)
                })
            },
            change_english(val){
                let chinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if (val.match(chinese)) {
                    this.baseData.declare_en_name = val.replace(chinese, "")
                }
            },
            change_box(){
//                    console.log(this.tags)
            },
            next_step(){
                this.dialogVisible = false;
                if(!this.muiSelects[this.baseData.category_id]){
                    return "";
                }
                let name=this.$refs.categories.label;
                this.baseData.category=name;
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
//            TODO 打开链接
            open_link(url){
                let b=url.substring(0,7);
                if(b==="http://" || b==="https:/"){
                    window.open(url)
                }else {
                    window.open(`http://${url}`);
                }
            },
//            TODO 添加链接
            add_link(){
                console.log("添加链接");
                this.baseData.source_url.push("");
            },
//            TODO 删除链接
            del_link(index){
                this.baseData.source_url.splice(index, 1);
                alert(`删除第${index + 1}个链接`);
            },
            submit(){
                let a = false;
                this.$refs.base.validate((valid)=> {
                    console.log(valid);
                    if (valid) {
                        a = true
                    }
                });
                if(this.baseData.warehouse_id){
                    a = true
                }
                return a;
            }

        },
        watch: {
            unitData:{
                handler(val){
                    console.log(val,'val');
                },
                deep:true
            },
        },
        components: {
            erpLabel,
            card,
            muiSelect,
            uiInput,
            pageDialog,
            uiSelect: require('../../../components/ui-select.vue').default,
            selectText:require('../../../components/select-text.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number.vue').default,
            categories:require("./categories.vue").default
        },
        props: {
            baseData: {
                required: true,
                type: Object
            },
            unitData: {
                required: true,
                type: Array
            },
            editAble: {
                required: true,
                type: Boolean
            },
            isShow: {
                default(){
                    return false;
                }
            },
            isAdd: {
                default(){
                    return false;
                }
            }
        }
    }
</script>
