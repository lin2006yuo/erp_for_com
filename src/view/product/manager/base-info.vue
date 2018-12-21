<template>
    <el-row class="c-base-info">
        <!--<card label="产品信息">-->
            <!--TODO 上传图片-->
            <el-form :model="baseData" label-width="140px" :rules="rules" ref="base">
                <el-form-item label="本地分类：" required>
                    <span>{{baseData.category}}</span>
                    <el-button size="mini" type="primary"
                               @click.native="dialogVisible=true"
                               v-if="editAble">编辑</el-button>
                    <page-dialog title="提示" v-model="dialogVisible" :close-on-click-modal="false">
                        <categories v-model="baseData.category_id" :tree="muiSelects" ref="categories"></categories>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="mini"
                                       type="primary"
                                       @click.native="next_step"
                                       :disabled="!selectLast">选择并进行下一步</el-button>
                            <el-button size="mini"
                                       @click.native="dialogVisible = false">取消</el-button>
                        </span>
                    </page-dialog>
                </el-form-item>
                <el-form-item label="产品名称："
                              class="changeW"
                              required prop="name">
                    <ui-input :edit="editAble"
                              v-model="baseData.name"
                              class="inline"></ui-input>
                </el-form-item>
                <el-form-item label="SPU：" class="changeW">
                    <el-input v-model="baseData.spu"
                              v-if="editAble" class="inline"
                              :disabled="editAble"></el-input>
                    <span v-else>{{baseData.spu}}</span>
                </el-form-item>
                <el-form-item label="品牌1：" class="changeW" required  prop="brand_id">
                    <el-select class="pri-width"
                               placeholder="输入搜索更多"
                               ref="brand" filterable default-first-option
                               v-mouse-side.mousewheel="()=>{$refs.brand.visible=false}"
                               remote :remote-method="remoteMethod"
                               @change="change_selects(baseData.brand_id,unitData[1].brand,'brand')"
                               v-model="baseData.brand_id"
                               v-if="editAble">
                        <el-option v-for="brand in brandList"
                                   :key="brand.id" :label="brand.name"
                                   :value="brand.id"></el-option>
                    </el-select>
                    <span v-else>{{baseData.brand}}</span>
                </el-form-item>
                <el-form-item label="产品侵权风险：" required prop="tort_id">
                    <el-col :span="10">
                        <el-select class="inline pri-width"
                                   ref="tort"
                                   v-mouse-side.mousewheel="()=>{$refs.tort.visible=false}"
                                   v-model="baseData.tort_id"
                                   @change="change_selects(baseData.tort_id,unitData[4].tort,'tort')"
                                   v-if="editAble">
                            <el-option v-for="tort in unitData[4].tort"
                                       :key="tort.id" :label="tort.name"
                                       :value="tort.id"></el-option>
                        </el-select>
                        <span v-else>{{baseData.tort}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="产品最低限价：" required prop="retail_price">
                    <el-input-number
                            size="small"
                            v-model="baseData.retail_price"
                            v-if="editAble"
                            :min="0"
                            :debounce="0"
                            :controls="false">
                    </el-input-number>
                    <span v-else>{{baseData.retail_price}}</span>
                </el-form-item>
                <el-form-item label="产品物流属性：" required>
                    <div v-if="!editAble">
                        <el-tag type="success"
                                v-for="it in baseData.properties"
                                class="ml-xs"
                                :key="it.name"
                                v-if="it.enabled"
                        >{{it.name}}</el-tag>
                    </div>
                    <div v-else>
                        <el-checkbox  v-for="it in baseData.properties"
                                      :key="it.name" v-model="it.enabled">
                            {{it.name}}
                        </el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="商品中文报关名称：">
                    <el-col :span="5">
                        <ui-input :edit="editAble"
                                  v-model="baseData.declare_name"
                                  class="inline"></ui-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品英文报关名称：">
                    <el-col :span="5">
                        <ui-input :edit="editAble"
                                  v-model="baseData.declare_en_name"
                                  class="inline"
                                  @input="change_english"
                        ></ui-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="海关编码(HS Code)：">
                    <ui-input :edit="editAble"
                              v-model="baseData.hs_code"
                              class="inline"></ui-input>
                </el-form-item>
                <el-form-item label="开发员：">
                    <el-select :edit="editAble"
                               filterable clearable
                               ref="developer"
                               v-mouse-side.mousewheel="()=>{$refs.developer.visible=false}"
                               v-if="editAble"
                               v-model="baseData.developer_id"
                               @change="change_selects(baseData.developer_id,development,'developer')"
                               class="pri-width">
                        <el-option v-for="item in development"
                                   :key="item.id" :label="item.realname"
                                   :value="item.id" ></el-option>
                    </el-select>
                    <span v-else>{{baseData.developer}}</span>
                </el-form-item>
                <el-form-item label="开发时间：">
                    <span>{{baseData.create_time}}</span>
                </el-form-item>
                <el-form-item label="商品尺寸："
                              class="input-box" required >
                    <label>长：</label>
                    <span v-if="!editAble"
                          class="inline">{{baseData.depth}}</span>
                    <ui-limit-number
                            class="inline width-xs"
                            v-else v-model="baseData.depth"
                            :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">宽：</label>
                    <span v-if="!editAble"
                          class="inline">{{baseData.width}}</span>
                    <ui-limit-number
                            class="inline width-xs"
                            v-else v-model="baseData.width"
                            :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">高：</label>
                    <span v-if="!editAble"
                          class="inline">{{baseData.height}}</span>
                    <ui-limit-number
                            class="inline width-xs"
                            v-else v-model="baseData.height"
                            :limit="1"></ui-limit-number>
                    <label>cm</label>
                    <label class="ml-xs">体积重：</label>
                    <span v-if="!editAble"
                          class="inline">{{volume}}</span>
                    <el-input v-else
                              class="inline"
                              v-model="volume"
                              type="number" disabled></el-input  >
                    <label>g</label>
                </el-form-item>
                <el-form-item label="产品净重："
                              class="input-box" required prop="net_weight">
                    <ui-limit-number
                            class="inline width-xs"
                            v-if="editAble"
                            v-model="baseData.net_weight"
                            :limit="1"></ui-limit-number>
                    <span class='operate'
                          v-else>{{baseData.net_weight}}</span>
                    <label>g</label>
                </el-form-item>
                <el-form-item label="产品毛重："
                              class="input-box"
                              required prop="weight">
                    <ui-limit-number class="inline width-xs"
                                     v-if="editAble"
                                     v-model="baseData.weight"
                                     :limit="1"></ui-limit-number>
                    <span class='operate' v-else>{{baseData.weight}}</span>
                    <label>g</label>
                </el-form-item>
                <el-form-item label="是否含包装：" required prop="is_packing">
                    <el-select v-if="editAble"
                               ref="packing"
                               v-mouse-side.mousewheel="()=>{$refs.packing.visible = false}"
                               v-model="baseData.is_packing"
                               class="pri-width">
                        <el-option v-for="item in wapper"
                                   :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <span v-else>{{comPacking}}</span>
                </el-form-item>
                <el-form-item label="包装材料：" required prop="packing_id">
                    <el-select class="pri-width"
                               ref="packingId"
                               v-model="baseData.packing_id"
                               v-mouse-side.mousewheel="()=>{$refs.packingId.visible = false}"
                               @change="change_selects(baseData.packing_id,unitData[3].packing,'package')"
                               v-if="editAble">
                        <el-option v-for="packing in unitData[3].packing"
                                   :key="packing.id" :label="packing.name"
                                   :value="packing.id"></el-option>
                    </el-select>
                    <span v-else > {{baseData.package}} </span>
                </el-form-item>
                <el-form-item label="产品单位：" required prop="unit_id">
                    <el-select class="pri-width" v-model="baseData.unit_id"
                               ref="unitId"
                               v-mouse-side.mousewheel="()=>{$refs.unitId.visible = false}"
                                 @change="change_selects(baseData.unit_id,unitData[0].unit,'unit')"
                                 v-if="editAble">
                        <el-option v-for="unit in unitData[0].unit"
                                   :key="unit.id" :label="unit.name"
                                   :value="unit.id"></el-option>
                    </el-select>
                    <span v-else >{{baseData.unit}}</span>
                </el-form-item>
                <el-form-item label="默认仓库：" required prop="warehouse_id" >
                    <el-select class="pri-width"
                               ref="warehouseId"
                               v-mouse-side.mousewheel="()=>{$refs.warehouseId.visible = false}"
                               v-model="baseData.warehouse_id"
                               @change="change_selects(baseData.warehouse_id,unitData[6].depot,'warehouse')"
                               v-if="editAble">
                        <el-option v-for="unit in unitData[6].depot"
                                   :key="unit.id" :label="unit.name"
                                   :value="unit.id"></el-option>
                    </el-select>
                    <span v-else>{{baseData.warehouse}}</span>
                </el-form-item>
                <el-form-item label="是否存在于多仓库："
                              required prop="is_multi_warehouse">
                    <el-select v-if="editAble"
                               ref="multiWarehouse"
                               v-mouse-side.mousewheel="()=>{$refs.multiWarehouse.visible = false}"
                               v-model="baseData.is_multi_warehouse"
                               class="pri-width">
                        <el-option v-for="item in multi"
                                   :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <span v-else>{{comMulWare}}</span>
                </el-form-item>
                <el-form-item label="参考网站链接：">
                    <div v-if="!editAble"  v-for="(url,i) in baseData.source_url" :key="i">
                            <conjoined-button :data-list="buttonName"
                                              @click="click_button(url,$event)"></conjoined-button>
                    </div>
                    <div v-if="editAble" v-for="(urls,index) in baseData.source_url" :key="index">
                        <div>
                            <el-input style="width:300px" class="inline" v-model="baseData.source_url[index]">
                            </el-input>
                            <el-button size="mini" type="success" :disabled="!baseData.source_url[index]" @click="open_link(urls)">打开链接</el-button>
                            <el-button size="mini" type="danger"
                                       class="el-icon-delete"
                                       v-show="baseData.source_url.length>1"
                                       @click="del_link(index)">
                            </el-button>
                        </div>
                    </div>
                    <div v-if="editAble">
                        <el-button size="mini" @click.native="add_link"
                                   type="primary" class="mt-xs">添加链接</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    <div v-if="editAble">
                        <request-button req-key="baseInfo" @click="keep_">保 存</request-button>
                        <el-button size="mini"
                                   @click="cancel_">取消</el-button>
                    </div>
                    <el-button size="mini" type="primary" v-else  @click="edit">编   辑</el-button>
                </el-form-item>
            </el-form>
        <!--</card>-->
    </el-row>
</template>
<style lang="stylus">
    .c-base-info{
    .pri-width{
        width:172px;
    }
    .margin-B{
        margin-bottom: -10px;
    }
    .changeW{//改变input margin-right
    margin-right:335px;
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
    .input-box{
    label{
        color:#1f2d3d;
    }
    .min-width{
        width:70px;
    }
    }

    }
</style>
<script>
    import{api_development} from "../../../api/product-library"
    import card from '../../../components/card.vue';
    import erpLabel from '../../../components/erp-label';
    import  uiInput from  '../../../components/ui-input.vue'
//    import muiSelect from '../../../components/mui-select.vue';
    import {api_get_categories} from   '../../../api/categories';
    import pageDialog from  "../../../components/page-dialog.vue"
    export default{
        data(){
                let weight=(rule, value, callback)=>{
                let val=Number(value);
                let baseweight=Number(this.baseData.net_weight);
                if(val&&baseweight&&val>=baseweight){
                    callback();
                }else {
                    callback(new Error('毛重应大于净重'));
                }
            };
            let net_weight=(rule, value, callback)=>{
                let val=Number(value);
                let basenetweight=Number(this.baseData.weight);
                if(val&&basenetweight&&val<=basenetweight){
                    callback();
                }else {
                    callback(new Error('净重应小于毛重'));
                }
            };
            return{
                buttonName:[
                    {label:'打开链接',value:1},
                    {label:'复制链接',value:2},
                ],
                development:[],
                dialogVisible:false,
                multi:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                wapper:[
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                tags:['11111'],
                classify:0,
                selected_obj:{},
                muiSelects:{},
                brandList:[],
                rules:{
                    name: [
                        { required: true, message: '请输入产品名称', trigger: 'blur' },
                    ],
                    tort_id:[
                        {required:true,message:'请选择产品风险',trigger:'blur,change',type:"number"}
                    ],
                    brand_id:[ {required:true,message:'请选择产品风险',trigger:'blur,change',type:"number"}],
                    retail_price:[
                        {required:true,message:'请输入零售价',trigger:'blur' ,type:"number"}
                    ],
                    warehouse_id:[
                        {required:true,message:'请选择默认仓库',trigger:'blur',type:"number"}
                    ],
                    weight:[{required: true, message: '请输入产品净重', trigger: 'blur'},
                        { validator: weight, trigger: 'change,blur' }
                    ],
                    net_weight:[{required: true, message: '请输入产品毛重', trigger: 'blur'},
                        {validator:net_weight, trigger: 'change,blur' }
                    ],
                    is_packing:[ {required:true,message:'请选择是否包装',trigger:'blur,change',type:"number"}],
                    packing_id:[ {required:true,message:'请选择包装材料',trigger:'blur,change',type:"number"}],
                    unit_id:[ {required:true,message:'请选择产品单位',trigger:'blur,change',type:"number"}],
                    is_multi_warehouse:[ {required:true,message:'请选择是否多仓库',trigger:'blur,change',type:"number"}],
                },
            }
        },
        mounted(){
            this.$http(api_get_categories).then(date=>{
                this.muiSelects = date;
            }).catch(code=>{
                console.log(`错误代码${code}`);
            });
            this.get_developer();
        },
        filters:{

        },
        computed:{
            comPacking(){
                return this.get_label(this.baseData.is_packing,this.wapper);
            },
            comMulWare(){
                return this.get_label(this.baseData.is_multi_warehouse,this.multi);
            },
            volume(){
                return (this.baseData.depth*this.baseData.width*this.baseData.height/6).toFixed(2);
            },
            selectLast(){
                return true;
            },
            baseData:{
                get(){
                    if(this.base.length===0){
                        return {}
                    }else {
                        return this.base[0]
                    }
                },
                set(val){
                    console.log(val);
                }
            },
        },
        methods:{
            remoteMethod(query) {
                if (query !== '') {
                    setTimeout(() => {
                        this.brandList = this.unitData[1].brand.filter(item => {
                            if(typeof query === 'number'){
                                return item.id === query
                            }else{
                                return item.name.toLowerCase()
                                    .indexOf(query.toLowerCase()) > -1;
                            }
                        });
                    }, 200);
                } else {
                    if(this.unitData[1].brand&&this.unitData[1].brand.length>50){
                        this.brandList = this.unitData[1].brand.splice(1,50);
                    }else{
                        this.brandList = this.unitData[1].brand
                    }
                }
            },
            click_button(url,data){
                if(data.value===1){
                    this.open_link(url);
                }else if(data.value===2){
                    this.copy_link(url);
                }
            },
            get_label(value_id,Array){
                let cur = '';
                if(value_id!==''){
                    let find = Array.find(row=>row.value===value_id);
                    cur = !!find?find.label:"";
                }
                return cur;
            },
            change_selects(id,selects,attr){
                let find=selects.find(row=>{
                    return row.id===id;
                });
                if(!!find){
                    this.baseData[attr]=find.name||find.realname;
                }
            },
            change_plat(item){
                console.log("444");
                let find=this.unitData[7].plat.find(row=>{
                    return row.id===item.value_id
                });
                if(!!find){
                    item.value=find.name;
                }
            },
            get_developer(){
                this.$http(api_development).then(res=>{
                    this.development=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            change_box(){
                console.log(...arguments)
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
            //打开链接
            open_link(url){
                let b=url.substring(0,7);
                if(b==="http://" || b==="https:/"){
                    window.open(url)
                }else {
                    window.open(`http://${url}`);
                }
            },
            //复制链接
            copy_link(link){
                let input=document.createElement("input");
                let body=document.getElementsByTagName("body")[0];
                input.type= 'text';
                input.value=link;
                body.appendChild(input);
                input.select();
                document.execCommand("Copy");
                body.removeChild(input);
                this.$message({type:"success",message:"复制成功"});
            },
            //添加链接
            add_link(){
                console.log("添加链接");
                this.baseData.source_url.push("");
            },
            //删除链接
            del_link(index){
                this.baseData.source_url.splice(index,1);
            },
            keep_(){
            	let find = this.baseData.properties.find(res=>{
            		return res.enabled === true;
                });
            	if(!find){
                    this.$message({type:'warning',message:`请至少选择一种产品物流属性!`});
                    return;
                }
                this.baseData.weight = this.baseData.weight.toString();
                this.baseData.net_weight = this.baseData.net_weight.toString();
                for(let i = 0; i < this.unitData[6].depot.length; i++){
                    if(this.unitData[6].depot[i].id === this.baseData.warehouse_id){
                        this.baseData.warehouse = this.unitData[6].depot[i].name;
                        break;
                    }
                }
                if(this.submit()){
                    this.$emit("keep");
                }else{
                    this.$reqKey('baseInfo',false);
                }
            },
            cancel_(){
                this.$emit("cancel")
            },
            edit(){
                this.$emit("edit")
            },
            submit(){
                let a = false;
                this.$refs.base.validate((valid)=>{
                    if (valid) {
                        a = true;
                    }
                });
                return a;
            },
            change_english(val){
                let chinese=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if(val.match(chinese)){
                    this.form.en_customs_title=val.replace(chinese,"")
                }
            }
        },
        watch:{

        },
        props:{
            base:{
                required:true,
                type:Array
            },
            unitData:{
                required:true,
                type:Array
            },
            editAble:{
                required:true,
                type:Boolean
            },
        },
        components:{
            erpLabel,
            card,
            uiInput,
            pageDialog,
            uiLimitNumber:require('../../../components/ui-limit-number.vue').default,
            categories:require("./categories.vue").default,
            uiSelect:require('../../../components/ui-select.vue').default,
            conjoinedButton:require('../../../components/conjoined-button').default,
        },
    }
</script>
