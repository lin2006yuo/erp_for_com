<template>
    <page  class="over-flow-auto" v-loading="loading">
        <el-card class="bottom-distance">
            <!--关联商品-->
            <relation-goods :form="form" @add-account="add_account" :curPage="param.curPage"></relation-goods>
            <el-tabs v-model="curAccount" type="border-card" :editable="param.curPage==='not'"
                     @edit="handleTabsEdit">
                <el-tab-pane
                        v-if="form.vars&&form.vars.length>0"
                        v-for="(item, index) in form.vars"
                        :key="item.account_code"
                        :label="item.account_code"
                        :name="item.account_code">
                    <!--基本信息-->
                    <basic-data :form="item"></basic-data>
                    <!--图片与描述-->
                    <picture-describe :form="item" :cur-page="param.curPage"></picture-describe>
                    <!--物流信息-->
                    <logistics-setting :form="item"></logistics-setting>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <div class="page-fixed">
            <el-button type="primary" size="mini" class="inline" @click.native="apply_all" v-if="form.vars.length>1">应用到所有</el-button>
            <el-button type="primary" size="mini" class="inline" @click.native="submit_publish" v-if="param.curPage==='not'">提交刊登</el-button>
            <el-button type="primary" size="mini" class="inline" @click.native="update_publish" v-else>更新刊登</el-button>
            <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
        </div>
        <add-account v-model='addAccountDialog'
                     @add-data="add_new_data"
                     :accountList="comAccountList"></add-account>
    </page>
</template>
<style lang="stylus" scoped>
    .bottom-distance{
        margin-bottom:30px;
    }
</style>
<script>
    import {api_shopee_getdata,api_shopee_publish,api_shopee_attribute,
        api_shopee_account,api_shopee_logistics,api_shopee_add,api_shopee_update} from '@/api/shopee-publish';
	export default{
        page: {
            multiple: true,
        },
		data(){
			return {
                addAccountDialog:false,
                loading:false,
                curAccount:'',
                form:{
                    goods_id:'',
                    name:'',
                    spu:'',
                    brand:'',
                    category:'',
                    vars:[]
                },
                accountList:[],
                initVarsObj:{},//自定义变量，盛放选品刊登进入详情页面时的初始数据vars,
                accountLogisticsObj:{},//自定义变量，盛放每个账号下的物流方式
            }
		},
        mounted(){
            if (window.objlength(this.param) === 0)return;
            this.loading = true;
            this.init();
        },
        methods:{
            add_account(){
                this.addAccountDialog = true;
            },
            add_new_data(val){
                this.add_data(val);
            },
            handleTabsEdit(val, action){
                if (action === "remove") {
                    let cur = this.form.vars.findIndex(row => {
                        return row.account_code === val;
                    });
                    if (cur > -1) this.form.vars.splice(cur, 1);
                    let length = this.form.vars.length;
                    if (!!length) {
                        this.curAccount = this.form.vars[length - 1].account_code;
                    }
                }
            },
            async init(){
                if(this.param.curPage==='not'){
                    await this.get_account();
                    this.add_init_info().then(res=>{
                        this.loading = false;
                        let find = this.accountList.find(row=>row.account_id ===this.param.account_id);
                        if(find) this.add_data([find]);
                    });
                }else if(this.param.curPage==='onSale'||this.param.curPage==='record'||this.param.curPage==='haltSale'||this.param.curPage==='soldOut'){
                    this.edit_publish();
                }
            },
            /**
             * 在售Listing 的编辑
             * */
             edit_publish(){
                this.$http(api_shopee_publish,this.param.id,'edit').then(res => {
                    if(res.vars.length<=0)return this.$message({type:"warning",message:'暂无详情数据'});
                    this.$set(this.form,'goods_id',this.param.goods_id);
                    this.$set(this.form,'name',res.name);
                    this.$set(this.form,'spu',res.spu);
                    this.$set(this.form,'brand',res.brand);
                    this.$set(this.form,'category',res.category);
                    this.$set(this.form,'id',res.id);
                    this.$set(this.form,'vars',[]);
                    this.arrange_edit_data(res);
                }).catch(code => {
                    console.log(code,'code');
                }).finally(()=>{
                    this.loading = false;
                })
             },
            /*整理编辑数据
            * */
            arrange_edit_data(source){
                source.vars.forEach(row=>{
                    this.$set(row,'goods_id',this.param.goods_id);
                    this.$set(row,'base_url',source.base_url);
                    this.$set(row,'curPage',this.param.curPage);
                    row.cron_time = row.cron_time?row.cron_time*1000:'';
                    row.variant = !!row.variant?row.variant.map(item=>{
                        this.$set(item,'sku',item.variation_sku);
                        return item;
                    }):[];
                    row.logistics = !!row.logistics?JSON.parse(row.logistics):[];
                    row.logistics.forEach(item=>{
                        item.is_checked = item.is_checked===1?true:false;
                        let weight_limits = JSON.parse(item.weight_limits);
                        console.log(weight_limits,'weight_limits');
                        console.log(this.trans_max_min_weight(weight_limits),'this.trans_max_min_weight(weight_limits)');
                        this.$set(item,'weight_limits',this.trans_max_min_weight(weight_limits));
                    });
                    row.wholesales = !!row.wholesales?JSON.parse(row.wholesales):[];
                    row.images = !!row.images?JSON.parse(row.images).map(item=>{
                        return {
                            base_url:row.base_url,
                            path:item
                        }
                    }):[];
                    if(row.days_to_ship>5){
                        this.$set(row,'deliver_goods_date',row.days_to_ship);
                        row.days_to_ship = 0;
                    }else{
                        row.days_to_ship = 5;
                    }
                    row.attributes = JSON.parse(row.attributes);
                    row.attributes.forEach(item=>{
                        if(item.input_type==='COMBO_BOX'){
                            if(!!item.options&&item.options.length>20){
                                this.$set(item,'change_type',true)
                            }else{
                                this.$set(item,'change_type',false)
                            }
                        }
                    });

                    this.$nextTick(()=>{
                        this.form.vars.push(row);
                        this.curAccount = row.account_code;
                    });
                });
            },
            /**
             *选品刊登时请求的数据
             */
            add_init_info(){
                return this.$http(api_shopee_getdata,{goods_id:this.param.goods_id}).then(res => {
                    if(res.vars.length<=0)return this.$message({type:'warning',message:'当前spu无vars数据，请更换spu'});
                    this.form.name = res.name;
                    this.form.spu = res.spu;
                    this.form.brand = res.brand;
                    this.form.category = res.category;
                    this.form.goods_id = this.param.goods_id;
                    this.form.base_url = res.base_url;
                    this.initVarsObj = res.vars[0];
                    this.$set(this.initVarsObj,'base_url',res.base_url);
                    if(this.initVarsObj['variant']){
                        this.initVarsObj['variant'].forEach(row=>{
                            this.$set(row,'isCheck',true);
                            this.$set(row,'stock',1000)
                        });
                    }
                    return Promise.resolve();
                }).catch(code => {
                    console.log(code);
                })
            },
            /**
             *选品刊登&添加账号--》初始数据
             */
            add_data(val){
                val.forEach(row=>{
                    let find = this.form.vars.find(item=>item.account_code === row.code);
                    if(!!find)return;
                    let cloneVars = clone(this.initVarsObj);
                    cloneVars['account_id'] = row.account_id;
                    cloneVars['account_code'] = row.code;
                    cloneVars['goods_id'] = this.param.goods_id;
                    cloneVars['curPage'] = this.param.curPage;
                    cloneVars['days_to_ship'] = 5;
                    cloneVars['site_id'] = row.site_id;
                    cloneVars['deliver_goods_date'] = '';//自定义 用于物流信息-->发货日期-->自定义发货时间
                    cloneVars['radioData'] = 1;//自定义 用于选品刊登时选择中文还是英文的详情描述,值——>1:中文 2：英文
                    this.get_shopee_logistics(row.account_id).then(logistics=>{
                        console.log(logistics,'logistics');
                        cloneVars['logistics'] = logistics;
                    });
                    cloneVars.wholesales = [];
                    cloneVars.images = cloneVars.images.map(img=>{
                        return {
                            base_url:this.form.base_url,
                            path:img
                        }
                    });
                    this.form.vars.push(cloneVars);
                });
                this.$nextTick(()=>{
                    let length = this.form.vars.length;
                    if(length<=0)return;
                    this.curAccount = this.form.vars[length-1].account_code;
                });
            },
            /**
             * 应用到所有
             */
            apply_all(){
                this.$confirm('您确定要将当前页面内容覆盖到其他已选的平台帐号中吗？,此操作将会覆盖其他已选帐号中的部分数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let templateData = this.form.vars.find(row=>row.account_code === this.curAccount);
                    if(templateData){
                        this.form.vars.forEach(row=>{
                            if(row.account_code!==this.curAccount){
                                const cloneCode = row.account_code;
                                const cloneAccountId = row.account_id;
                                const cloneSiteId = row.site_id;
                                const cloneAttrList = row.attributes;
                                const cloneCategoryId = row.category_id;
                                const cloneCategoryName = row.category_name;
                                const cloneLogistics = row.logistics;
                                Object.assign(row,templateData);
                                console.log(row,'row');
                                row.account_code = cloneCode;
                                row.account_id = cloneAccountId;
                                row.site_id = cloneSiteId;
                                row.attrList = cloneAttrList;
                                row.category_id = cloneCategoryId;
                                row.category_name = cloneCategoryName;
                                row.logistics = cloneLogistics;
                            }
                        })
                    }
                })
            },
            /**
             *提交刊登
             */
            submit_publish(){
                if(!this.verification_data())return;
                let data = this.arrange_data();
                this.$http(api_shopee_add,data).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.close_router();
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            /*更新刊登
            * */
            update_publish(){
                if(!this.verification_data())return;
                let data = this.arrange_data();
                this.$http(api_shopee_update,data).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.close_router();
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            /*验证必填项
            * */
            verification_data(){
                let canSubmit = true;
                this.form.vars.forEach(row=>{
                    if(!row.category_id)return canSubmit = this.warning_tips(row.account_code,`产品分类`);
                    if(!row.name) return canSubmit = this.warning_tips(row.account_code,`刊登标题`);
                    if(!row.item_sku) return canSubmit = this.warning_tips(row.account_code,`主商品货号`);
                    if(row.wholesales.length>0){
                        let findWhole = row.wholesales.find(item=>!item.min||!item.max||!item.unit_price);
                        if(!!findWhole) return canSubmit = this.warning_tips(row.account_code,`批发销售`);
                    }
                    if(!row.weight) return canSubmit = this.warning_tips(row.account_code,`商品重量`);
                    if(row.variant.length>0){
                        let find = row.variant.find(it=>!it.stock||!it.price||!it.sku);
                        if(!!find) return canSubmit = this.warning_tips(row.account_code,`SKU信息中'平台SKU'、'销售价'、'可售量'`);
                    }
                    if(row.variant.length>1){
                        let findName = row.variant.find(it=>!it.name);
                        if(!!findName) return canSubmit = this.warning_tips(row.account_code,`SKU信息中 '商品规格属性'`);
                    }
                    if(row.images.length<=0)return canSubmit = this.warning_tips(row.account_code,`刊登图片`);
                    if(row.attributes.length>0){
                        let findAttr = row.attributes.find(it=>it.is_mandatory&&!it.attribute_value);
                        if(!!findAttr) return canSubmit = this.warning_tips(row.account_code,`${findAttr.attribute_name}属性`);
                    }
                    if(!row.logistics||row.logistics.length<=0){
                        return canSubmit = this.warning_tips(row.account_code,`物流方式`);
                    }else if(row.logistics.length>=0){
                        let findLog = row.logistics.find(item=>item.is_checked);
                        if(!findLog){
                            canSubmit = false;
                            return this.$message({type:'warning',message:'至少启动一个物流方式'})
                        }
                    }
                    if(row.days_to_ship!==5){
                        if(Number(row.deliver_goods_date)<7) {
                            canSubmit = false;
                            return this.$message({type:'warning',message:'自定义发货时间需要大于等于7天'})
                        }else{
                            row.days_to_ship = Number(row.deliver_goods_date);
                        }
                    }
                });
                return canSubmit;
            },
            /*报错提醒
            * */
            warning_tips(account,tip){
                this.$message({type:'warning',message:`【${account}】账号，【${tip}】为必填项，请补充完整`});
                return false;
            },
            /*整理提交的数据*/
            arrange_data(){
                let cloneForm = clone(this.form);
                cloneForm.vars.forEach(row=>{
                    row.attributes = row.attributes.map(item=>{
                        delete item.options;
                        return item;
                    });
                    let curImages = row.images.map(row=>row.path);
                    row.images = curImages.length<=9?curImages:curImages.splice(0,9);
                    if(row.curPage==='not'&&row.radioData===1){
                        row.description = row.description_zh;
                        delete row.description_zh;
                    }
                    row.logistics = row.logistics.filter(item=>item.is_checked).map(item=>{
                        this.$set(item,'is_checked',1);
                        return item
                    });
                    console.log(row.logistics,'row.logistics');

                    row.variant = row.variant.map(row=>{
                        let curRow = {
                            refer_name:row.refer_name,
                            name:row.name,
                            cost_price:row.cost_price,
                            price:row.price,
                            stock:row.stock,
                        };
                        if(this.param.curPage!=='not'&&row.vid&&row.pid){
                            this.$set(curRow,'vid',row.vid?row.vid:0);
                            this.$set(curRow,'pid',row.pid?row.pid:0);
                            this.$set(curRow,'variation_sku',row.sku);
                            this.$set(curRow,'variation_id',row.variation_id);
                        }else{
                            this.$set(curRow,'sku',row.sku);
                            this.$set(curRow,'id',row.id);
                        }
                        return curRow;
                    });
                    delete row.account_name;
                    delete row.base_url;
                    delete row.goods_id;
                    delete row.curPage;
                    delete row.deliver_goods_date;
                });
                delete cloneForm.name;
                return cloneForm;
            },
            /**
             *取消  用于关闭整个详情页面
             */
            cancel(){
                if (this.isChange) {
                    return this.$confirm(`您的页面有更改尚未保存，确认离开此页面吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.close_router();
                    })
                } else {
                    this.close_router();
                }
            },
            close_router(){
                if(this.param.curPage==='edit'){
                    this.$close(`/shopee/info-detail`);
                }else{ //not/record/haltSale/soldOut
                    this.$close(`/shopee/info-detail?id=${this.param.curPage}${this.param.goods_id}`);
                }
            },
            /**获取账号
             */
            async get_account(){
                await this.$http(api_shopee_account,{is_invalid:1,pageSize:99999}).then(res => {
                    this.accountList = res.map(row=>{
                        return {
                            code:row.code,
                            account_id:row.account_id,
                            account_name:row.account_name,
                            site_id:row.site_id,
                            disabled:false,
                            realname:row.realname
                        }
                    });
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            /**
             * 获取物流方式
             */
            get_shopee_logistics(account_id){
                return this.$http(api_shopee_logistics,{account_id:account_id}).then(res => {
                    console.log(res,'res');
                    res = res.map(row=>{
                        let weight_limits = JSON.parse(row.weight_limits);
                        return {
                            is_checked:true,
                            enabled:row.enabled,
                            logistic_name:row.logistic_name,
                            weight_limits:this.trans_max_min_weight(weight_limits),
                            is_free:0,
                            logistic_id:Number(row.logistic_id)
                        }
                    });
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code);
                })
            },
            /**转换物流方式中的最大公斤数和最小公斤数
             * */
            trans_max_min_weight(row){
                let spliceData = '';
                let max = `最大${row['item_max_weight']}公斤`;
                let min = `最小${row['item_min_weight']}公斤`;
                if(!!row['item_max_weight']&&!!row['item_min_weight']){
                    spliceData = max+min;
                }else if(!!row['item_min_weight']){
                    spliceData = min;
                }else if(!!row['item_max_weight']){
                    spliceData = max;
                }
                return spliceData;
            },
            get_shopee_attr(category_id){
                return this.$http(api_shopee_attribute,{category_id:category_id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code,'code');
                })
            },
        },
        computed:{
            comAccountList(){
                this.accountList.forEach(row=>{
                    let find = this.form.vars.find(res=>res.account_code===row.code);
                    this.$set(row,'disabled',!!find);
                });
                console.log(this.accountList,'this.accountList');
                return this.accountList;
            },
        },
        watch:{
            param(val){
                if (window.objlength(val) === 0)return;
                this.init();
            },
        },
		components: {
		    rainbowHeader:require('@/components/rainbow-header.vue').default,
            relationGoods:require('./info-detail-components/relation-goods.vue').default,
            addAccount:require('@/view/kandeng/ebay/kandeng-list/add-edit-listing/add-account.vue').default,
            basicData:require('./info-detail-components/basic-data.vue').default,
            pictureDescribe:require('./info-detail-components/picture-describe').default,
            logisticsSetting:require('./info-detail-components/logistics-setting').default,
        }
	}
</script>
