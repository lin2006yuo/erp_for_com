<template>
    <page-dialog :title="title" v-model="show" width="45%" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-tabs type="card" v-model="select">
            <el-tab-pane label="平台信息" name="平台信息">
                <el-form :model="addEditData"
                         :rules="rules"
                         label-width="190px"
                         ref="addEditDataInfo">
                    <el-form-item v-if="!judge || iscCludes" label="平台ID：">
                        <el-col :span="14">
                            <span>{{addEditData.id}}</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="添加时间：" v-if="!title.includes('添加账号')&&judge">
                        <el-col :span="14">
                            <span v-if="!!addEditData.create_time" >{{addEditData.create_time}}</span>
                            <span v-else>- -</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="更新时间：" v-if="!judge">
                        <el-col :span="14">
                            <span v-if="!!addEditData.update_time">{{addEditData.update_time}}</span>
                            <span v-else>- -</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台名称：" prop="title">
                        <el-col :span="14">
                            <el-input v-model.trim="addEditData.title" :disabled="!judge"></el-input>
                            <!--<el-input v-else v-model.trim="addEditData.title" disabled></el-input>-->
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台英文名称：" prop="name">
                        <el-col :span="14">
                            <el-input v-model.trim="addEditData.name" :disabled="!judge"></el-input>
                            <!--<el-input v-else v-model.trim="addEditData.name" disabled></el-input>-->
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否有站点：" prop="is_site">
                        <el-col :span="14">
                            <el-select v-model="addEditData.is_site" :disabled="!judge">
                                <el-option v-for="item in siteList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-select v-else v-model="addEditData.is_site" disabled>-->
                                <!--<el-option v-for="item in siteList"-->
                                           <!--:key="item.value"-->
                                           <!--:label="item.label"-->
                                           <!--:value="item.value">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-col>
                    </el-form-item>
                    <!--<el-form-item label="平台订单过期时间：" prop="delivery_deadline">-->
                    <!--<el-col :span="14">-->
                    <!--<el-input-number v-if="judge" class="inline" :debounce="0" v-model="addEditData.delivery_deadline" :min="1"></el-input-number>-->
                    <!--<span v-else>{{addEditData.delivery_deadline}}</span>-->
                    <!--<span>天</span>-->
                    <!--</el-col>-->
                    <!--</el-form-item>-->
                    <el-form-item label="状态：" prop="status">
                        <el-col :span="14">
                            <el-select v-model="addEditData.status" :disabled="!judge">
                                <el-option v-for="item in statusList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-select v-else v-model="addEditData.status " disabled>-->
                                <!--<el-option v-for="item in statusList"-->
                                           <!--:key="item.value"-->
                                           <!--:label="item.label"-->
                                           <!--:value="item.value">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-col>
                    </el-form-item>
                    <el-form-item label="">
                        <el-col :span="14">
                            <el-button type="primary" size="mini" v-if="judge"
                                       @click.native="save_platform_message">保 存
                            </el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="平台参数" name="平台参数" v-if="title!=='添加账号'">
                <platform-param @add-param="add_param"
                                :platform-table="platformTable"
                                :judge="judge"
                                @del="del"
                                @submit="save_platform_config">
                </platform-param>
            </el-tab-pane>
        </el-tabs>
        <add-platform-param v-model="paramConfigShow"
                            :paramData="paramData"
                            @select-change="select_platform_param"
                            @submit="add_platform_param">
        </add-platform-param>
        <div slot="footer" class="dialog-footer">
            <!--<el-button type="primary" size="mini" v-if="judge" @click.native="keep">确定</el-button>-->
            <el-button size="mini" @click.native="close_dialog">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .checkbox-rule-auto{
        display flex
        align-items flex-start
        .rule-span{
            margin-left .416667rem
            line-height 1.333333rem
        }
    }
</style>
<script>
    import {api_get_platform_param,api_save_platform_param,api_get_platform_config,
        api_post_channel,api_put_channel,api_update_platform_config} from '@/api/platform-management';
    import { setTimeout } from 'timers';
    import addPlatformParam from './add-platform-param'
    export default {
        data() {
            var checkNum=(rule, value, callback)=>{
                if(value===''){
                    return callback(new Error('必填项不能为空!'));
                }else if(value<0||value%1!=0){
                    return callback(new Error('请输入自然数!'));
                }else{
                    callback();
                }
            };
            return {
                checked: false,
                show: this.value,
                select:this.celect,
                amazon:this.isAmazon,
                siteList: [
                    {label: '无', value: 0},
                    {label: '有', value: 1},
                ],
                statusList: [
                    {label: '启用', value: 0},
                    {label: '停用', value: 1},
                ],
                rules: {
                    title: [
                        {required: true, message: '请输入平台名称', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入平台英文名称', trigger: 'change'}
                    ],
                    is_site: [
                        {required: true, message: '站点为必填项', trigger: 'change', type: "number"}
                    ],
                    // delivery_deadline: [
                    //     {required: true,validator:checkNum, trigger: 'change'}
                    // ],
                    // examination_cycle:[
                    //     {required:true,validator:checkNum,trigger:'change'}
                    // ],
                    // list_num:[
                    //     {required:true,validator:checkNum,trigger:'change'}
                    // ]
                },
                // multipleSelection:[],
                addParamsData:[],
                flagMessage: false,
                // value1:true,
                // innerShow:false,
                // innerTitle:'',
                paramConfigShow:false,
                paramData:[],
                selectPlatformParam:[],
                platformTable:[]
            };
        },
        methods: {
            open() {
                if(this.title.includes('添加')){
                    this.addEditData.title = '';
                    this.addEditData.name = '';
                    this.addEditData.is_site = '';
                    // this.addEditData.delivery_deadline = '';
                    this.addEditData.status = 0;
                    this.addEditData.duplication = false;
                    // 作一个记录添加的话，在点击确定的话，就跳转到相应的页面。
                    this.flagMessage = true;
                } else {
                    this.flagMessage = false;
                }
                this.selectPlatformParam=[];
            },
            close() {
                this.amazon=false;
            },
            save_platform_message(){
                this.$refs.addEditDataInfo.validate(valid=>{
                    if(valid){
                        let data={
                            title:this.addEditData.title,
                            name:this.addEditData.name,
                            is_site:this.addEditData.is_site,
                            status:this.addEditData.status,
                        };
                        if(this.title==='添加账号'){
                            this.$http(api_post_channel,data).then(res=>{
                                this.$message({type:'success',message:res.message||res});
                                this.show=false;
                                this.$emit('refresh');
                            }).catch( error =>{
                               error&&this.$message({type:'error', message:error.message||error});
                            });
                        }else{
                            this.$http(api_put_channel,this.addEditData.id,data).then(res=>{
                                console.log(res,12213);
                                this.$message({type:'success',message:res.message||res});
                            }).catch( error =>{
                                error&&this.$message({type:'error', message:error.message||error});
                            });
                        }
                    }else{
                        console.error('验证不通过');
                    }
                })
            },
            save_platform_config(){
                let tempArr=this.platformTable.map(row=>{
                    let value;
                    if(row.type===1||row.type===2){
                        value=row.value;
                    }else if(row.type===3){
                        if(row.choose_type){//1 参考站点设置
                            if(row.setting&&row.setting.length){
                                let val=[];
                                row.setting.forEach(set=>{
                                    if(set.checked){
                                        let child={value:set.value};
                                        if(set.choose_type){
                                            let filter=set.child.filters(child=>child.checked);
                                            child.child=filter.length?filter.map(filter=>{
                                                return {key:filter.key, value:filter.value}
                                            }):[];
                                        }else{
                                            if(set.choose){
                                                let find=set.child.find(child=>child.value===set.choose);
                                                child.child=!!find?[find]:[]
                                            }else{
                                                child.child=[]
                                            }
                                        }
                                        val.push(child)
                                    }
                                });
                                value=val;
                            }
                        }else{//0
                            let currentValue=row.show?(row.currentVal?'1':'0'):row.currentVal;
                            if(row.show){
                                value={value:currentValue,child:[]}
                            }else{ //没有测试数据对照，参考站点设置
                                if(row.setting&&row.setting.length){
                                    row.setting.forEach(set=>{
                                        if(set.value===currentValue&&set.child.length){
                                            if(set.choose_type){
                                                let filter=set.child.filter(child=>child.checked);
                                                value={value:currentValue,child:filter.length?filter.map(filter=>{
                                                        return {key:filter.key,choose_type:filter.choose_type,value:filter.value}
                                                    }):[]}
                                            }else{
                                                let find=set.child.find(child=>child.value===set.choose);
                                                value={value:currentValue,child:!!find?[set]:[]}
                                            }
                                        }else{
                                            value={value:currentValue,child:[]}
                                        }
                                    })
                                }else{
                                    value={value:currentValue,child:[]}
                                }
                            }
                        }
                    }
                    return {
                        type:row.type,
                        name:row.name,
                        choose_type:row.choose_type,
                        value:value
                    }
                });
                let platformObj={};
                tempArr.forEach(row=>{
                    platformObj[row.name]=row.value;
                });
                this.$http(api_update_platform_config,this.addEditData.id,platformObj).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                }).catch( error =>{
                   error&&this.$message({type:'error', message:error.message||error});
                });
            },
            keep() {
                // let _switch=false;
                // this.$refs.addEditDataPara.validate((bool) => {
                //     if (bool) {
                //         _switch=true;
                //     } else {
                //         setTimeout(() => {
                //             this.$reqKey('addKeep', false);
                //         }, 300)
                //     }
                // });
                // if (this.flagMessage) {
                //     this.select = '平台参数';
                // }
                // this.$refs.addEditDataInfo.validate((bool) => {
                //     if (bool) {  //if(bool&&_switch)
                //         this.$emit('add-keep',this.rowId);//-------事件抛出
                //     } else {
                //         setTimeout(() => {
                //             this.$reqKey('addKeep', false);
                //         }, 300)
                //     }
                // });
            },
            add_param(){
                this.paramData=[];
                this.$http(api_get_platform_param,{channel_id:this.rowId}).then(res=>{
                    res.forEach(row=>{
                        this.$set(row,'title',`${row.title}(${row.name})`);
                    });
                    this.paramData=res;
                    this.paramConfigShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            select_platform_param(selected){
                this.selectPlatformParam=selected;
            },
            add_platform_param(){
                if(!this.selectPlatformParam.length){
                    return this.$message({type:'warning',message:'请选择平台参数！'})
                }
                this.$http(api_save_platform_param,this.rowId,{
                    id:this.rowId,
                    config_id:this.selectPlatformParam.map(row=>row.id)
                }).then(res=>{
                    this.$message({type:'success', message:res.message||res});
                    this.get_platform_config();
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_platform_config(){
                this.$http(api_get_platform_config,this.rowId,{channel_id:this.rowId}).then(res=>{
                    console.log(res,12213);
                    let arr=['tort_ebay','tort_amazon','tort_wish','tort_aliexpress','tort_pandao','tort_joom','tort_shopee'];
                    res.config.forEach(row=>{//参考站点设置页面平台参数
                        let bool=arr.includes(row.name);
                        this.$set(row,'title',`${row.title}(${row.name})`);
                        this.$set(row,'show',bool);
                        if(row.setting&&{}.toString.call(row.setting)==='[object Array]'){
                            row.setting.forEach(item=>{
                                if(item.child&&item.child.length){
                                    item.choose_type=item.child[0].choose_type;
                                    if(item.child[0].choose_type===1){
                                        item.choose='';
                                    }else if(item.child[0].choose_type===0){
                                        item.child.forEach(it=>{
                                            it.checked=false;
                                        });
                                    }
                                }
                            })
                        }
                        if(row.type===3){
                            if(row.choose_type===1){//测试找不到这个数据沿用站点设置的写法
                                if({}.toString.call(row.setting)==='[object Array]'){
                                    row.setting.forEach(it=>{
                                        let find=row.value.find(child=>child.key.value===it.value);
                                        row.checked=!!find;
                                        if(find&&it.child&&it.child.length){
                                            if(it.choose_type===0){
                                                it.choose=find.child[0].value;
                                            }else{
                                                it.child.forEach(set=>{
                                                    let findChild=find.child.find(child=>child.value===set.value);
                                                    set.checked=!!findChild;
                                                });
                                            }
                                        }
                                    })
                                }
                            }else if(row.choose_type===0){
                                this.$set(row,'currentVal',row.show?!!Number(row.value.value):row.value.value);
                                let find=row.setting.find(set=>set.value===row.value.value);
                                if(find&&row.value.child&&row.value.child.length){//setting //测试找不到这个数据沿用站点设置的写法
                                    if(find.choose_type===0){
                                        find.choose=row.value.child[0].value;
                                    }else{
                                        find.child.forEach(child=>{
                                            let findChild=row.value.child.find(item=>item.value===child.value);
                                            child.checked=!!findChild;
                                        });
                                    }
                                }
                            }
                        }
                    });
                    this.platformTable=res.config;
                    this.paramConfigShow=false;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            del(item){
                let index=this.platformTable.findIndex(row=>row.id===item.id);
                this.platformTable.splice(index,1);
            },
            close_dialog(){
                this.show=false;
                this.amazon=false;
                this.$emit('refresh');
            }
        },
        filters: {
            filterSite(value) {
                return parseInt(value) ? '有' : '无';
            },
        },
        computed: {
            iscCludes() {
                return this.title.includes('编辑');
            },
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
                if(val&&this.rowId){
                    this.get_platform_config();
                }
            },
            amazon(val){
                this.$emit('update:isAmazon',val)

            },
            isAmazon(val){
                this.amazon=val;
            },
            select(val){
                this.$emit('update:celect',val)
            },
            celect(val){
                this.select = val
            },
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            addEditData: {
                required: true,
                type: Object
            },
            judge: {//判断是否可编辑
                required: true,
                type: Boolean
            },
            isAmazon:{
                required:true,
                type:Boolean
            },
            rowId:{
                required:true,
                type:Number
            },
            celect:{}//判断当前active的pane
        },
        components: {
            platformParam:require('./platform-param').default,
            addPlatformParam
        }
    }
</script>
