<template>
    <page class="p-product-info">
        <el-form :model="checkForm" :rules="rules" label-width="180px">
            <card label="产品信息">
                <el-form-item label="分类：" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.category}}</span>
                    <div v-else>
                        <span>{{checkForm.category}}</span>
                        <el-button type="info" size="mini"  @click.native="dialogTableVisible = true">编辑</el-button>
                        <page-dialog title="产品分类选项" v-model="dialogTableVisible" size="small" :close-on-click-modal="false" >
                            <mui-select :parent="0" :select="muiSelects" @selected="selected"></mui-select>
                            <span slot="footer" class="dialog-footer">
                                <el-button size="mini" @click.native="nextStep" :disabled="!selectLast">选择并继续下一步</el-button>
                                <el-button size="mini" type="primary" @click.native="dialogTableVisible = false">关闭</el-button>
                            </span>
                        </page-dialog>
                    </div>
                </el-form-item>

                <el-form-item label="产品名称："  prop="name">
                    <span class="check-color" v-if="markId===1">{{checkForm.name}}</span>
                    <el-input v-model="checkForm.name"  @input="check_name" style="width:200px" v-else></el-input>
                </el-form-item>

                <el-form-item label="品牌：" >
                    <span class="check-color" v-if="markId===1">{{checkForm.brand}}</span>
                    <el-select v-model="checkForm.brand_id" placeholder="请选择类型" style="width:200px" v-else>
                        <el-option
                                :key="item.id"
                                v-for="item in brands"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="" class="img-absolute">
                    <image-upload :thumbnail-mode="true" :multiple="false" :image="{width:'100px',height:'100px'}"   :init="init" ></image-upload>
                </el-form-item>

                <el-form-item label="产品侵权风险：" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.tort}}</span>
                    <el-select v-model="checkForm.tort_id" style="width:200px" v-else>
                        <el-option
                                :key="item.id"
                                v-for="item in torts"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="产品最低限价：" prop="retail_price">
                    <span class="check-color" v-if="markId===1">{{checkForm.retail_price}}</span>
                    <el-input v-model="checkForm.retail_price" style="width:200px" v-else></el-input>
                </el-form-item>

                <el-form-item label="产品物流属性：" required>
                    <div v-if="markId===1">
                        <el-tag type="primary" v-for="item in checkForm.properties" :key="item.name" v-if="item.enabled" style="margin-right:5px ;">{{item.name}}</el-tag>
                    </div>
                    <div v-else >
                        <el-card class="proper-box">
                            <el-checkbox v-model="item.enabled" v-for="item in checkForm.properties" :key="item.name">{{item.name}}</el-checkbox>
                        </el-card>
                    </div>
                </el-form-item>

                <el-form-item label="商品中文报关名称：">
                    <span class="check-color" v-if="markId===1">{{checkForm.declare_name}}</span>
                    <el-input v-model="checkForm.declare_name" style="width:400px" v-else></el-input>
                </el-form-item>

                <el-form-item label="商品英文报关名称：" prop="declare_en_name">
                    <span class="check-color" v-if="markId===1">{{checkForm.declare_en_name}}</span>
                    <el-input v-model="checkForm.declare_en_name" style="width:400px" v-else></el-input>
                </el-form-item>

                <el-form-item label="海关编码(HS Code)：">
                    <span class="check-color" v-if="markId===1">{{checkForm.hs_code}}</span>
                    <el-input v-model="checkForm.hs_code" style="width:200px" v-else></el-input>
                </el-form-item>

                <el-form-item label="产品尺寸：" class="input-box">
                    <label>长：</label>
                    <span class="check-color" v-if="markId===1">{{checkForm.depth}}</span>
                    <el-input v-model="checkForm.depth" style="width:100px" class="inline" type="number" min="0" @blur="blur_depth()" v-else></el-input>
                    <label>cm</label>
                    <label class="ml-xs">宽：</label>
                    <span class="check-color" v-if="markId===1">{{checkForm.width}}</span>
                    <el-input v-model="checkForm.width" style="width:100px" class="inline" type="number" min="0" @blur="blur_width()" v-else></el-input>
                    <label>cm</label>
                    <label class="ml-xs">高：</label>
                    <span class="check-color" v-if="markId===1">{{checkForm.height}}</span>
                    <el-input v-model="checkForm.height" style="width:100px" class="inline" type="number" min="0" @blur="blur_height()" v-else></el-input>
                  <!--  <input style="width:100px" class="inline el-input__inner" v-model="checkForm.height" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"  type="number" min="0" v-else>-->
                    <label>cm</label>
                    <label class="ml-xs">体积重：</label>
                    <span class="check-color" v-if="markId===1">{{checkForm.volume_weight}}</span>
                    <el-input style="width:100px" class="inline " v-model="volume_weight" :disabled="true" v-else></el-input>
                    <label>g</label>
                </el-form-item>


                <el-form-item label="产品净重：" class="inline" required >
                    <span class="check-color" v-if="markId===1">{{checkForm.net_weight}}</span>
                    <el-input v-model="checkForm.net_weight" style="width:150px" class="inline" type="number" min="0" @blur="blur_net_weight()" v-else></el-input>
                    <label>g</label>
                </el-form-item>

                <el-form-item label="产品毛重：" class="inline" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.weight}}</span>
                    <el-input v-model="checkForm.weight" style="width:150px" class="inline" type="number" min="0" @blur="blur_weight()" v-else></el-input>
                    <label>g</label>
                </el-form-item>

                <el-form-item label="产品是否自带包装：" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.is_packing|packingFilter}}</span>
                    <el-select v-model="checkForm.is_packing" style="width:200px" v-else>
                        <el-option
                                :key="item.value"
                                v-for="item in ispack"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="打包材料：">
                    <span class="check-color" v-if="markId===1">{{checkForm.package}}</span>
                    <el-select v-model="checkForm.packing_id" style="width:200px" v-else>
                        <el-option
                                :key="item.id"
                                v-for="item in packs"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="产品单位：">
                    <span class="check-color" v-if="markId===1">{{checkForm.unit}}</span>
                    <el-select v-model="checkForm.unit_id" style="width:200px" v-else>
                        <el-option
                                :key="item.id"
                                v-for="item in units"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="默认仓库：" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.warehouse}}</span>
                    <el-select v-model="checkForm.warehouse_id" style="width:200px" v-else>
                        <el-option
                                :key="item.id"
                                v-for="item in warehouse"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否存在于多仓库：">
                    <span class="check-color" v-if="markId===1">{{checkForm.is_multi_warehouse|warehouseFilter}}</span>
                    <el-select v-model="checkForm.is_multi_warehouse" style="width:200px" v-else>
                        <el-option
                                :key="item.value"
                                v-for="item in multi_warehouse"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="参考网站链接："  v-if="markId===1">
                    <span class="check-color" style="padding-right: 10px;" v-for="key in checkForm.source_url" :key="key">{{key}}</span>
                </el-form-item>

                <el-form-item label="参考网站链接：" v-else>
                    <el-row style="padding-bottom: 5px"  v-for="(item,index) in checkForm.source_url" :key="index">
                        <el-col :span="10">
                          <!--  <el-input type="url" v-model="checkForm.source_url[index]"></el-input>-->
                            <el-input type="url" placeholder="请输入网址" v-model="checkForm.source_url[index]">
                                <template slot="prepend">Http://</template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <a  :href="'http://'+item" target="_blank" class="product-link">打开参考链接</a>

                           <!-- <el-button size="mini" type="info" style="margin-left:5px">打开参考链接</el-button>-->
                            <el-button size="mini" type="primary" icon="delete"  @click="del_link(index)" v-show="checkForm.source_url.length>1"></el-button>
                        </el-col>
                    </el-row>
                    <el-button size="mini" type="info" @click="add_link" style="margin-top:5px">添加链接</el-button>
                </el-form-item>
                <el-form-item label="销售平台状态：">
                    <table class="template" style="width:800px">
                        <tr>
                            <th v-for="item in checkForm.platform_sale" :key="item.title">{{item.title}}</th>
                        </tr>
                        <tbody>
                        <template>
                            <tr>
                                <td v-for="item in checkForm.platform_sale">
                                    <span class="check-color" v-if="markId===1">{{item.value}}</span>
                                    <el-select  v-model="item.value_id" v-else>
                                        <el-option v-for="data in platform" :key="item.id" :value="data.id" :label="data.name" :disabled="data.disabled"></el-option>
                                    </el-select>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="产品关键词：">
                    <div v-if="markId===1">
                        <el-tag type="primary" v-for="item in checkForm.tags" :key="item" style="margin-right:5px ;">{{item}}</el-tag>
                    </div>
                    <div v-else style="width:800px">
                        <!--<el-checkbox v-model="item.isCheck" v-for="item in checkForm.tags">{{item.name}}</el-checkbox>-->
                        <textarea-format v-model="checkForm.tags"></textarea-format>
                    </div>
                </el-form-item>
                <el-form-item label="产品描述：" required>
                    <span class="check-color" v-if="markId===1">{{checkForm.description}}</span>
                    <el-input type="textarea" v-model="checkForm.description" placeholder="描述内容" style="width:800px" v-else></el-input>
                </el-form-item>
            </card>
        </el-form>
    </page>
</template>
<style lang="stylus">
    .p-product-info{
        .check-color{
            color: rgb(0, 139, 206);
        }
        .card-label{
            margin-top:10px
        }
        .img-absolute{
            position: absolute;
            top: 110px;
            right: 28%;
        }
        .proper-box{
            width: 600px;
            .el-checkbox + .el-checkbox{
                margin-left: 0;
            }
            .el-checkbox{
                margin-right: 10px;
            }
        }
        .product-link{
            display: inline-block;
            background: #20a0ff;
            color: white;
            text-align: center;
            border-radius: 5px;
            width: 90px;
            margin-left: 5px;
            &:hover {
                font-size: 1.25rem;
            }
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import muiSelect from '../../../components/mui-select.vue';
    import pageDialog from '../../../components/page-dialog.vue';
    import {api_get_categories} from '../../../api/categories';
    import {chinese} from '../../../define/validator_reg';
    import {product_unit,product_packing,product_brand,product_tort,warehouse_type,product_goodsdev,product_attr,product_properties,api_platform} from '../../../api/product_create'
    export default{
        data(){
            var check = (rule, value, callback) => {
                setTimeout(() => {
                    if (!/^\d+(\.\d{2})?$/.test(value)) {
                    callback(new Error('请输入正确金额，应输入两位小数的非负浮点数'));
                }else{
                    callback();
                    }
                }, 1000);
            };
            var englishName = (rule, value, callback) => {
                if (chinese.test(value)) {
                    callback(new Error('请输入英文名称'));
                }else{
                    callback();
                }
            };
            return {
                init:[],
                muiSelects:{},
                selected_obj:{},
                dialogTableVisible:false,
                tagList:[],
                units:[],
                packs:[],
                brands:[],
                torts:[],
                warehouse:[],
                platform:[],
                ispack:[
                    {value: 1, label: '是'},
                    {value: 0, label: '否'}
                ],
                multi_warehouse:[
                    {label:"是",value:1},
                    {label:"否",value:0}
                ],
                rules: {//------------------表单验证
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    retail_price: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { validator: check, trigger: 'blur' }
                    ],
                    declare_en_name:[
                        { validator: englishName, trigger: 'blur' }
                    ]

                }
            }
        },
        created(){
        },
        mounted(){
            /*------分类接口*/
            this.$http(api_get_categories).then(res=>{
                this.muiSelects = res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            /*---------------------selected下拉框数据 接口*/
            this.$http(product_unit).then(res=>{
                this.units=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            this.$http(product_packing).then(res=>{
                this.packs=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            this.$http(product_brand).then(res=>{
                this.brands=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            this.$http(product_tort).then(res=>{
                this.torts=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            this.$http(warehouse_type).then(res=>{
                this.warehouse=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});

            this.$http(api_platform).then(res=>{
                this.platform=res;
//                可选上架为不可选择
                this.platform.forEach(row=>{
                    row.id===0&&(row.disabled=true)
                })
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            /*-----物流属性*/
            this.$http(product_properties).then(res=>{
                this.checkForm.properties=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
        },
        methods: {
            get_attr(data){
                /*-----根据分类更改规格参数跟属性*/
                this.$http(product_goodsdev,data).then(res=>{
                    this.checkForm.specification=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
                this.$http(product_attr,data).then(res=>{
                    this.checkForm.attributes=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
                /*--------end*/
            },
            get_categories(data){
                /*-----------根据产品分类id获得产品名称*/
                this.$http(api_get_categories).then(res=>{
                    this.muiSelects = res;
                    if(!this.muiSelects[data]){
                        return "";
                    }
                    let name=[];
                    if(this.muiSelects[data].parents){
                        name = this.muiSelects[data].parents.map(parent=> {
                            return this.muiSelects[parent].title;
                        });
                    }
                    name.push(this.muiSelects[data].title);
                    name = name.join(">>");
                    this.checkForm.category = name;
                    this.get_attr(data);
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            selected(selected){ //--------------更改产品分类
                this.checkForm.category_id = selected.value;
                this.selected_obj=selected;
            },
            nextStep(){//--------保存并继续下一步(产品分类)
               this.dialogTableVisible = false;
                this.get_categories(this.checkForm.category_id);
            },
            add_link() {//----添加链接
                this.checkForm.source_url.push("");
            },
            del_link(index) {//--删除链接
                this.checkForm.source_url.splice(index,1);
            },
            check_name() {
                this.checkForm.name=this.checkForm.name.replace(/\s*/g,"")
            },
            //产品尺寸 长宽高 净重 毛重 input失去焦点事件
            blur_depth(){
                if (Number(this.checkForm.depth) < 0) {
                    this.checkForm.depth = 0;
                }
                this.checkForm.depth = Number(this.checkForm.depth).toFixed(1);
            },
            blur_width(){
                if (Number(this.checkForm.width) < 0) {
                    this.checkForm.width = 0;
                }
                this.checkForm.width = Number(this.checkForm.width).toFixed(1);
            },
            blur_height(){
                if (Number(this.checkForm.height) < 0) {
                    this.checkForm.height = 0;
                }
                this.checkForm.height = Number(this.checkForm.height).toFixed(1);
            },
            blur_weight(){
                if (Number(this.checkForm.weight) < 0) {
                    this.checkForm.weight = 0;
                }else if(Number(this.checkForm.weight) < Number(this.checkForm.net_weight)){
                  this.checkForm.weight = Number(this.checkForm.net_weight);
                }
                this.checkForm.weight = Number(this.checkForm.weight).toFixed(1);
            },
            blur_net_weight(){
                if (Number(this.checkForm.net_weight) < 0) {
                    this.checkForm.net_weight = 0;
                }
                this.checkForm.net_weight = Number(this.checkForm.net_weight).toFixed(1);
            }
        },
        filters: {
            packingFilter(val){
                if(val===1){
                    return '是'
                }else{
                    return '否'
                }
            },
            warehouseFilter(val){
                if(val===1){
                    return '是'
                }else{
                    return '否'
                }
            }
        },
        watch: {
            /*-----------上传图片*/
            init(val){
                let image=val.length>0?val[0].image:'';
                let image_name=val.length>0?val[0].name:'';
                this.checkForm.image=image;
                this.checkForm.image_name=image_name
            }
        },
        computed: {
            selectLast(){ //-----------保存并继续下一步是否可选(产品分类)
                return this.selected_obj.isLast;
            },
            volume_weight(){ //----------自动计算商品体积
                return (this.checkForm.depth*this.checkForm.width*this.checkForm.height/6).toFixed(2)
            }
        },
        props: {
            checkForm:{
                required:true,
                type:Object
            },
            markId:{},
            categoryId:{}
        },
        components: {
            card,
            muiSelect,
            pageDialog,
            imageUpload:require('./image-upload.vue').default,
            textareaFormat:require('../../../components/textarea-format.vue').default
        }
    }
</script>
