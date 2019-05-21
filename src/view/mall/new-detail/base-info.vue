<template>
    <el-row class="c-base-info">
        <el-col :span="24">
            <el-col :span="24">
                <label class="box-label">{{label}}</label>
            </el-col>
            <el-form :model="baseForm"  label-width="180px" :rules="rules" ref="baseForm">
                <el-form-item label="分类：">
                    <span class="width-percent-large">{{baseForm.category}}</span>
                    <!--2017/11/29日 按照最新原型图更改-->
                    <!--<el-button v-if="baseEdit" size="mini" type="primary" @click.native="dialogVisible=true">编辑</el-button>-->
                    <!--<page-dialog title="提示" v-model="dialogVisible" size="small" :close-on-click-modal="false">-->
                    <!--<mui-select :parent="0" :select="muiSelects" @selected="selected"></mui-select>-->
                    <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button size="mini" @click.native="next_step" :disabled="!selectLast">选择并进行下一步</el-button>-->
                    <!--<el-button size="mini" type="primary" @click.native="dialogVisible = false">确 定</el-button>-->
                    <!--</span>-->
                    <!--</page-dialog>-->
                </el-form-item>
                <el-form-item label="开发平台：">
                    <label-select class="width-percent-default"
                                  :edit="baseEdit"
                                  v-model="baseForm.channel_id"
                                  :lists="channelList"></label-select>
                </el-form-item>
                <el-form-item label="产品名称：" prop="name">
                    <ui-input class="width-percent-large" :edit="baseEdit" v-model="baseForm.name"></ui-input>
                </el-form-item>
                <el-form-item label="产品图片：">
                    <div class="picture-box" v-for="item in baseForm.images" :key="item">
                        <img src="item" v-if="item" width="100%" height="100%">
                    </div>
                </el-form-item>
                <el-form-item label="是否需要拍照：">
                    <label-select class="width-percent-default"
                                  v-model="baseForm.is_photo"
                                  :edit="baseEdit"
                                  :lists="photographList"></label-select>
                </el-form-item>
                <el-form-item label="拍照要求：">
                    <el-input
                            v-model="baseForm.photo_remark"
                            class="width-percent-super"
                            v-if="baseEdit"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入拍照要求...">
                    </el-input>
                    <label v-else>{{baseForm.photo_remark}}</label>
                </el-form-item>
                <el-form-item label="未处理图片路径：">
                    <ui-input class="width-percent-super"
                              v-model="baseForm.undisposed_img_url"
                              :edit="baseEdit" ></ui-input>
                </el-form-item>
                <el-form-item label="SPU：">
                    <el-input class="inline width-percent-default"
                              v-if="baseEdit"
                              v-model="baseForm.spu"
                              :disabled="true"></el-input>
                    <span v-else class="inline ml-sm">{{baseForm.spu}}</span>
                    <label class="inline">（系统自动生成）</label>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="品牌：" required>
                            <label-select :edit="baseEdit"
                                          v-model="baseForm.brand_id"
                                          :lists="unitData.brands"></label-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否授权：" required>
                            <label-select v-model="baseForm.is_auth" :edit="baseEdit" :lists="accreditList"></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="产品侵权风险：" prop="tort_id">
                    <label-select class="width-percent-default" :edit="baseEdit" v-model="baseForm.tort_id" :lists="unitData.tort"></label-select>
                </el-form-item>
                <el-form-item label="最低限价(CNY)：" prop="cost_price">
                    <ui-input class="width-percent-default"  :edit="baseEdit" v-model="baseForm.cost_price"></ui-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="建议售价(CNY)：" prop="retail_price">
                            <ui-input :edit="baseEdit" v-model="baseForm.retail_price"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="竞争对手售价(CNY)：">
                            <ui-input :edit="baseEdit" v-model="baseForm.competitor_price"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="本平台预估毛利率：" prop="gross_profit">
                    <el-input class="inline width-percent-default inline"
                              v-if="baseEdit"
                              v-model="baseForm.gross_profit"></el-input>
                    <span v-else>{{baseForm.gross_profit}}</span>
                    <label class="inline ml-sm">%</label>
                </el-form-item>
                <el-form-item label="产品物流属性：">
                    <el-checkbox v-if="baseEdit"
                                 v-for="item in baseForm.properties"
                                 :key="item.name"
                                 v-model="item.enabled">{{item.name}}</el-checkbox>
                    <el-tag class="mr-xs"
                            v-for="item in baseForm.properties"
                            :key="item.name"
                            v-if="!baseEdit&&item.enabled" type="success">{{item.name}}</el-tag>
                </el-form-item>
                <el-row>
                    <el-form-item label="产品尺寸：" class="input-box">
                        <label>长</label>
                        <ui-limit-number v-if="baseEdit" class="inline width-xs"  v-model="baseForm.depth" :limit="1"></ui-limit-number>
                        <span v-else>{{baseForm.depth}}</span>
                        <label>cm</label>
                        <label class="ml-xs">宽</label>
                        <ui-limit-number v-if="baseEdit" class="inline width-xs"  v-model="baseForm.width" :limit="1"></ui-limit-number>
                        <span v-else>{{baseForm.width}}</span>
                        <label>cm</label>
                        <label class="ml-xs">高</label>
                        <ui-limit-number v-if="baseEdit" class="inline width-xs"  v-model="baseForm.height" :limit="1"></ui-limit-number>
                        <span v-else>{{baseForm.height}}</span>
                        <label>cm</label>
                        <label class="ml-xs">体积重</label>
                        <el-input  class="inline width-lg" v-if="baseEdit" v-model="volume_weight" :disabled="true"></el-input>
                        <span v-else>{{volume_weight}}</span>
                        <label>g</label>
                        <div class="pri-error" v-if="checkPlus">长/宽/高均为正数数字，当前输入有误，请检查后重新输入！</div>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item  class="input-box" label="产品净重(g)：" prop="net_weight">
                            <ui-limit-number v-if="baseEdit" v-model="baseForm.net_weight" :limit="1"></ui-limit-number>
                            <span class="inline" v-else>{{baseForm.net_weight}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item  class="input-box" label="产品毛重(g)：" prop="weight">
                            <ui-limit-number v-if="baseEdit" v-model="baseForm.weight" :limit="1"></ui-limit-number>
                            <span class="inline" v-else>{{baseForm.weight}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="产品是否自带包装：" required>
                    <label-select :edit="baseEdit"
                                  class="width-percent-default"
                                  v-model="baseForm.is_packing"
                                  :lists="hasWrappers"></label-select>
                </el-form-item>
                <el-row v-if="baseForm.is_packing===1">
                    <el-col :span="8">
                        <el-form-item label="前置打包材料：">
                            <label-select :edit="baseEdit"
                                          v-model="baseForm.pre_packing_id"
                                          :lists="unitData.packing"></label-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="后置打包材料：">
                            <label-select :edit="baseEdit"
                                          v-model="baseForm.next_packing_id"
                                          :lists="unitData.packing"></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="产品单位：">
                    <label-select :edit="baseEdit"
                                  class="width-percent-default"
                                  v-model="baseForm.unit_id"
                                  :lists="unitData.unit"></label-select>
                </el-form-item>
                <el-form-item label="采购链接：">
                    <el-row class="mb-mini">
                        <el-col :span="12">
                            <ui-input :edit="baseEdit" v-model="baseForm.link"></ui-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button  v-if="baseEdit"
                                        class="ml-xs"
                                        size="mini"
                                        type="success"
                                        @click="open_url(baseForm.link)">打开链接</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="平台链接：">
                    <el-row class="mb-mini" v-for="(item,index) in baseForm.source_url" :key="index">
                        <el-col :span="12">
                            <ui-input :edit="baseEdit" v-model="baseForm.source_url[index]"></ui-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button  v-if="baseEdit" class="ml-xs" size="mini" type="success" @click="open_url(item)">打开链接</el-button>
                            <el-button class="el-icon-delete" size="mini" type="danger" @click.native="delete_url(index)" v-if="index!==0&&baseEdit"></el-button>
                        </el-col>
                    </el-row>
                    <el-button v-if="baseEdit" size="mini" @click.native="add_url" type="primary">添加链接</el-button>
                </el-form-item>
                <el-form-item label="产品标签：">
                    <el-row>
                        <el-col :span="18">
                            <product-tag :form="baseForm"
                                         :desc-edit="baseEdit"
                            ></product-tag>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="产品描述：">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-if="baseEdit"
                                      v-model="baseForm.description"
                                      :autosize="{ minRows: 2, maxRows: 4}"
                                      type="textarea"
                                      size="mini"></el-input>
                            <span v-else>{{baseForm.description}}</span>
                        </el-col>
                    </el-row>
            </el-form-item>
            </el-form>
            <el-row class="mt-lg">
                <el-col :span="18" style="margin-left:178px">
                    <div v-if="baseEdit">
                        <request-button req-key="newBaseInfo" @click="save(baseForm.id)">确定</request-button>
                        <el-button  size="mini" @click.native="cancel">取消</el-button>
                    </div>
                    <el-button v-else type="primary" size="mini" @click.native="edit">编辑</el-button>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<style lang="stylus">
    .c-base-info{
        width:100%;
        .width-percent-large{
            width:30%;
        }
        .width-percent-default{
            width:25%;
        }
        .width-percent-super{
            width:50%;
        }
        .width-percent-small{
            width:15%;
        }
        .picture-box{
            width:50px;
            height:50px;
            border:1px solid #ddd;
        }
        .info-upload{
            position:absolute;
            top:50px;
            right:50px;
            .el-dragger{
                width: 100px;
                height: 100px;
            }
        }
        .pri-error{
            color: #ff4949;
            font-size: 1rem;
            line-height: 1;
            padding-top: 0;
            z-index: 10;
            position: absolute;
            top: 100%;
            left: 15px;
        }
        .tag-box{
            border:1px solid #ddd;
            height:150px;
            .tag-box-child{
                padding:10px 5px;
                margin:0 5px;
                border-bottom:1px dotted #ddd;
                height:100px;
                overflow-y: auto;
            }
            .input-box{
                &.el-input {
                    > .el-input__inner {
                        border-radius: 0 !important;
                        border: none !important;
                    }
                }
            }
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import erpLabel from '../../../components/erp-label';
    import muiSelect from '../../../components/mui-select.vue';
    import {api_get_categories} from '../../../api/categories';
    import {api_update_base} from '../../../api/product';
    import {plus,url,chinese,integer} from '../../../define/validator_reg';
    export default{
        data(){
            let plusNumber = (rule,value,callback)=>{
                if(value){
                    return !plus.test(value)?callback(new Error("请输入正数数字")):callback();
                }
            };
            let checkInteger = (rule,value,callback)=>{
              if(value){
                  return !integer.test(value)?callback(new Error("请输入整数")):callback()
              }else{
                  callback()
              }
            };
            let checkChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("不允许出现中文！")):callback();
                }else{
                    callback();
                }
            };
            return{
                dialogVisible:false,
                muiSelects:{},
                classify:0,
                selected_obj:{},
                photographList:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                //                 $targetDirs = ['eBay' => 1, 'Amazon' => 2, 'Wish' => 3, 'AliExpress' => 4];
                channelList:[
                    {label:"Ebay",value:1},
                    {label:"Wish",value:3},
                    {label:"速卖通",value:4},
                    {label:"亚马逊",value:2},
                ],
                accreditList:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                hasWrappers:[
                        {label:"是",value:1},
                        {label:"否",value:0},
                ],
                multi_warehouse:[
                    {label:"否",value:0},
                    {label:"是",value:1},
                ],
                fileList:[
                    {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
                    {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                    ],
                cloneData:{},
                rules:{
                    name: [
                        { required: true, message: '产品名称不能为空', trigger: "blur"}
                    ],
                    tort_id:[
                        {required:true,type:"number",message:'必选项',trigger:"blur"}
                    ],
                    retail_price:[
                        {required:true, message:'产品建议售价不能为空',trigger:"blur"},
                        {validator: plusNumber,trigger:'blur'}
                    ],
                    gross_profit:[
                        {required:true, message:'本平台预估毛利率不能为空',trigger:"blur"},
                        {validator: plusNumber,trigger:'blur'}
                    ],
                    weight:[
                        {validator: checkInteger,trigger:'blur'}
                    ],
                    net_weight:[
                        {validator: checkInteger,trigger:'blur'}
                    ],
                    declare_en_name:[
                        {validator:checkChinese,trigger:'blur'}
                    ]
                },
                checkPlus:false
            }
        },
        created(){
            api_get_categories().then(date=>{
                this.muiSelects=date;
            }).catch(code=>{
                console.log(`错误代码${code}`)
            });
        },
        watch:{
            volume_weight(val){
                this.checkPlus = !this.checkNumber(val);
            },
        },
        computed:{
            selectLast(){
                return true;
            },
            volume_weight(){
                return (this.baseForm.depth*this.baseForm.width*this.baseForm.height/6).toFixed(2);
            },
        },
        methods:{
            checkNumber(value){
                return !plus.test(value)?false:true;
            },
            next_step(){
                this.dialogVisible = false;
                if(!this.muiSelects[this.classify]){
                    return "";
                }
                let name = this.muiSelects[this.classify].parents.map(parent=> {
                    return this.muiSelects[parent].title;
                });
                name.push(this.muiSelects[this.classify].title);
                name = name.join(">>");
                this.baseForm.category=name;
            },
//          -------------------------------------------------------    面包屑 编辑
            selected(selected){
                this.classify = selected.value;
                this.selected_obj=selected;
            },
//            -----------------------------------------------------   上传图片
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
//            ----------------------------------------------------   保存
            save(id){
                this.$refs.baseForm.validate((valid)=>{
                    if(valid&&!this.checkPlus){
                        let temp = this.clone(this.baseForm);
                        temp.tags=this.unitData.tag.filter(item=>{
                            if(this.baseForm.tags.indexOf(item.name)!==-1){
                                return true
                            }
                        })
                        this.$emit("save");
                    }else{
                        setTimeout(() => {
                            this.$reqKey('newBaseInfo', false);
                        }, 300)
                    }
                });
            },
//            ----------------------------------------------------   编辑
            edit(){
                this.$emit("edit");
            },
//            ----------------------------------------------------   取消
            cancel(){
                this.$emit("cancel");
            },
//          ------------------------------------------------------    打开链接
            open_url(val){
               if(url.test(val)){
                   window.open(val);
               }else{
                   window.open("http://"+val);
               }
            },
//          -------------------------------------------------------    添加链接
            add_url(){
                this.baseForm.source_url.push("");
            },
//          --------------------------------------------------------   删除链接
            delete_url(index){
                this.$confirm('此操作将永久删除此链接, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.baseForm.source_url.splice(index,1);
                  this.$message({
                    type: 'success',
                    message: "删除成功"
                  })
                }).catch(() => {

                  this.$message({
                       type:'info',
                       message:"已取消删除"
                  })
                });
            },
//            -----------------------------------------------------  更新接口
            update_base_info(id,data){
                this.$http(api_update_base,id,data).then(res=>{
                    this.$message(res.message);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                })
            },
//            -----------------------------------------------------  clone
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
        },
        filters:{
            warehouseFilter(val){
                if(val===1){
                    return "是"
                }else {
                    return '否'
                }
            }
        },
        props:{
            label:{
                required:true,
                type:String
            },
            baseEdit:{
                required:true,
                type:Boolean
            },
            baseForm:{
                required:true,
                type:Object
            },
            unitData:{
                required:true,
                type:Object,
            }
        },
        components:{
            erpLabel,
            card,
            uiInput:require('../../../components/ui-input.vue').default,
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiSelect:require('../../../components/ui-select.vue').default,
            labelSelect:require('../../../components/label-select.vue').default,
            muiSelect:require('../../../components/mui-select.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number.vue').default,
            imgAdd:require('../../../components/img-add.vue').default,
            productTag:require('./product-tag.vue').default,
        }
    }
</script>
