<template>
    <page>
        <page class="over-flow-auto">
            <relevance-goods @add-account="add_account" :goods-name="publish.zh_name"
                             :web="publish.landing_page_url" :brand="publish.brand" :spu="publish.spu"
                             :warehouse="publish" :warehouse-list="warehouseList"></relevance-goods>
            <account-tab-box ref="tab-box" v-model='publish.publish_vars' :tab-name="tabName" :goods-id="goods_id"
                             :base-url="publish.base_url" :is-add="param.isAdd"
                             @change-name="change_name"></account-tab-box>
            <accounts v-model="accountVisible" :accounts="accounts" @selected="keep_channel" :show-store="true"
                      :col-show="false"></accounts>
            <div class="foot">
                <el-button size="mini" type="primary" @click.native="use_all" :disabled="isDis">应用到所有</el-button>
                <el-button size="mini" type="primary" @click.native="public_channel" :disabled="isDis">刊登到平台</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>
        </page>
    </page>
</template>

<style lang="stylus">
    .over-flow-auto {
        position: relative;
        padding-bottom: 45px;

    .foot {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 10px;
        z-index: 10001;
    }

    }
</style>
<script>
    import {api_info_data, api_joom_account, api_joom_publish, api_joom_store, api_joom_update, api_joom_account_and_store} from '../../../../api/publish-joom-info';
    import {api_get_joom_account, api_get_joom_store} from '../../../../api/joom-set-classify'
    import {warehouse_type} from '../../../../api/product_create'
    export default{
        page:{
            multiple: true,
            beforeClose(){
                if (!this.isChange) {
                    return true
                } else {
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        data(){
            return {
                tabName: '',
                accountVisible: false,
                accounts: [],
                goods_id: '',
                baseUrl: '',
                publish: {},
                warehouseList:[],
                isChange: false
            }
        },
        created(){

        },
        filters: {},
        mounted(){
            this.$http(warehouse_type).then(res=> {
                this.warehouseList = res;
            }).catch(code=> {
            });
            this.goods_id = this.param.goods_id;
            this.init();
        },
        updated(){
        },
        destroy(){
        },
        methods: {
            async init(){
                await this.get_account();
                if(this.param.isAdd){// 如果是未刊登 -》 刊登
                    if(this.param.shop_id !== '' && this.param.account_id !== ''){
                        let find = this.accounts.find(account=>{
                            return account.id === this.param.account_id
                        });
                        find.store_value = this.param.shop_id;
                        await this.get_info();
                        this.keep_channel([find]);
                    }else {
                        await this.get_info();
                    }
                }
                if(this.param.isEdit){ // 如果是编辑
                    if(!this.param.item.vars){
                        this.$message({
                            type: 'error',
                            message: '数据有误'
                        })
                    }
                    this.param.item.vars.forEach((item, index) => {
                        item.tab_label = `【${item.account_name}】${item.shop_name || ''}`;
                        item.variant.forEach(row=>{
                            let times = row.shipping_time.split('-');
                            this.$set(row, 'start',times[0]);
                            this.$set(row, 'end',times[1]);
                            this.$set(row, 'thumb', row.main_image);
                            this.$set(row,'check', true);
                            this.$set(row, 'addGoodsId', this.goods_id);
                        })
                    });
                    this.publish = this.param.item;
                    this.$set(this.publish,'publish_vars',window.clone(this.publish.vars));
                    this.tabName = this.publish.publish_vars[0].tab_label;
                }

                if(this.param.isCopy){ // 如果是复制
                    this.publish = this.param.item;
                    this.publish.vars.forEach((item, index) => {
                        item.variant.forEach(row=>{
                            this.$set(row,'check', true)
                        })
                    });
                    this.$set(this.publish,'publish_vars',[]);
                }
            },
            // 根据goods_id获取该商品所有信息
            async get_info(){
                let obj = {
                    goods_id: this.goods_id
                };
                let res = await this.$http(api_info_data, obj);
                res.vars.forEach((item, index) => {
                    item.tab_label = `【${item.account_name}】${item.shop_name || ''}`;
                    item.variant.forEach(row=>{
                        this.$set(row,'check', true)
                    })
                });
                this.publish = res;
                this.$set(this.publish,'publish_vars',[]);
            },
//            添加账号
            add_account(){
                this.publish.publish_vars.forEach(item => {
                    //  遍历勾选过的数据，查找账号，如果已经勾选过，则禁止勾选
                    this.accounts.find(row => {
                        if (item.account_name === row.name) {
                            row.disabled = true;
                            return true;
                        }
                    });
                });
                this.accountVisible = true;
            },
            change_name(val){
                this.tabName = val;
            },
            // 添加账号抛出的事件，抛出的未账号信息，并拼装上其他字段和默认值
            keep_channel(val){
                if(!!val){
                    val.forEach(item=>{
                        let publish_vars = window.clone(this.publish.vars[0]);
                        publish_vars.variant.forEach(sku=>{
                            if(this.param.isAdd){
                                this.$set(sku, 'start','');
                                this.$set(sku, 'end','');
                            }else {
                                let times = sku.shipping_time.split('-');
                                this.$set(sku, 'start',times[0]);
                                this.$set(sku, 'end',times[1]);
                                this.$set(sku, 'thumb', sku.main_image);
                            }
                            this.$set(sku, 'ref_color', sku.color);
                            this.$set(sku, 'ref_size', sku.size);
                            sku.inventory = sku.inventory || '9999'
                        });
                        publish_vars.account_id = item.id;
                        publish_vars.account_name = item.account_name;
                        publish_vars.shop_id = item.store_value;
                        publish_vars.realname = item.realname;
                        let find = item.shop.find(store=>{
                            return store.id === item.store_value
                        });
                        if(!!find){
                            publish_vars.shop_code = find.code;
                            publish_vars.shop_name = find.shop_name;
                        }
                        publish_vars.tab_label = `【${publish_vars.account_name}】${publish_vars.shop_name}`;

                        this.publish.publish_vars.push(publish_vars);
                    });
                }
                this.tabName = this.publish.publish_vars[0].tab_label;
            },
//            应用到所有
            use_all(){
                let find = this.publish.publish_vars.find(item => {
                    return item.tab_label === this.tabName;
                });
                this.publish.publish_vars.forEach(item=>{
                   let clone = window.clone(find);
                   item.name = clone.name;
                   item.description  = clone.description;
                   item.images = clone.images;
                   item.variant = clone.variant;
                   item.tags = clone.tags;
                   item.shipping_weight = clone.shipping_weight;
                });
                this.$message({
                    type: 'success',
                    message: '已应用到所有'
                })
            },
//            判断标题是否重复
            detect_name(name){
                let arr = name.split(/\s+/);
                let obj = {};
                for(let i =0;i<arr.length; i++){
                    let item = arr[i];
                    if(obj[item]){
                        this.$message({
                            type:'info',
                            message:"标题有重复"
                        });
                        return true;
                    }else {
                        obj[item] = true;
                    }
                }
            },
//            表单验证
            variant_verification(){
                let bool = true;
                let vars = this.publish.publish_vars;
                for(let i = 0; i< vars.length; i++){
                    let item = vars[i];
                    if(item.name === ''){
                        bool = false;
                        this.$message({
                             type:'info',
                             message:item.tab_label+"标题必填"
                        });
                        return false;
                    }
                    if(!!this.detect_name(item.name)){
                        bool = false;
                        this.$message({
                            type:'info',
                            message:item.tab_label+"标题单词有重复"
                        });
                        return false;
                    }
                    if(item.tags.length === 0){
                        bool = false;
                        this.$message({
                            type:'info',
                            message:item.tab_label+"标签必填"
                        });
                        return false;
                    }
                    let variant = item.variant.filter(row=>{
                        return row.check;
                    });
                    if(variant.length === 0){
                        bool = false;
                        this.$message({
                            type:'info',
                            message:item.tab_label+"请勾选sku，或者添加sku"
                        });
                        return false;
                    }
                    if(variant.length > 1){
                        for(let i =0; i< variant.length; i++){
                            if(variant[i].size === '' && variant[i].color === ''){
                                bool = false;
                                this.$message({
                                    type:'info',
                                    message:item.tab_label+"请填写一个颜色或尺寸"
                                });
                                return false
                            }
                        }
                    }
                    for(let i=0; i<variant.length; i++){
                        let row = variant[i];
                        if(this.to_str(row.price) === '0' || this.to_str(row.price).length === 0){
                            bool = false;
                            this.$message({
                                 type:'info',
                                 message:item.tab_label+"销售价必填且不能为0"
                            });
                            return false
                        }
                        if(this.to_str(row.color) === 'as the picture' || this.to_str(row.color) === 'As the picture'){
                            if(this.to_str(row.thumb).length === 0){
                                bool = false;
                                this.$message({
                                    type:'info',
                                    message:item.tab_label+"展图必选"
                                });
                                return false
                            }
                        }
                        if(row.shipping_weight === ''){
                            bool = false;
                            this.$message({
                                type:'info',
                                message:item.tab_label+"包装重量必填"
                            });
                            return false;
                        }
                        if(this.to_str(row.inventory).length === 0){
                            bool = false;
                            this.$message({
                                type:'info',
                                message:item.tab_label+"数量必填"
                            });
                            return false;
                        }
                        if(row.shipping === ''){
                            bool = false;
                            this.$message({
                                type:'info',
                                message:item.tab_label+"运费必填"
                            });
                            return false;
                        }
                        // if(this.to_str(row.start).length === 0){
                        //     bool = false;
                        //     this.$message({
                        //         type:'info',
                        //         message:item.tab_label+"开始时间必填"
                        //     });
                        //     return false;
                        // }
                        // if(this.to_str(row.start).length === 0){
                        //     bool = false;
                        //     this.$message({
                        //         type:'info',
                        //         message:item.tab_label+"结束时间必填"
                        //     });
                        //     return false;
                        // }
                    }
                    if(item.images.length === 0){
                        bool = false;
                        this.$message({
                            type:'info',
                            message:item.tab_label+"图片必选"
                        });
                        return false;
                    }
                    if(this.to_str(item.description).length === 0){
                        bool = false;
                        this.$message({
                            type:'info',
                            message:item.tab_label+"描述必填"
                        });
                        return false;
                    }
                }
                return bool;
            },
            to_str(val){
                if(!!val){
                    return String(val);
                }else {
                    return ''
                }
            },

//            刊登到平台
            public_channel(){
                if(!this.variant_verification()){
                    return
                }
                let obj = window.clone(this.publish);
                obj.publish_vars.forEach(item => {
                    item.images = item.images.map(img => {
                        return img.path;
                    });
                    item.tags = item.tags.map(tag=>{
                        return tag.name;
                    });
                    item.tags = item.tags.join(',');
                    item.variant.forEach(row=>{
                        row.main_image = row.thumb;
                        row.shipping_time = row.start + '-' + row.end;
                    })
                });
                obj.uid = 1;
                obj.vars =  obj.publish_vars;
                delete obj.publish_vars;

                if(this.param.isAdd){
                    return this.$http(api_joom_publish, obj).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        sessionStorage.setItem('joomInfoId',this.param.goods_id);
                        this.$close('/publish/joom/getData');
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message || code
                        })
                    })
                }else {
                    return this.$http(api_joom_update, obj).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.$close('/publish/joom/getData');
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message || code
                        })
                    })
                }

            },
            cancel(){
                this.$close('/publish/joom/getData');
            },
            async get_account(){
                let res = await this.$http(api_joom_account_and_store, {goods_id: this.goods_id})
                res.data.forEach((item, index) => {
                    item.disabled = false;
                    item.store_value = '';
                    item.account_name = item.name;
                });
                this.accounts = res.data;
            }
        },
        computed: {
        	isDis(){
                if(this.publish.publish_vars&&this.publish.publish_vars.length){
                	return false;
                }else{
                	return true;
                }
            },
        },
        watch: {
            publish:{
                handler(val, oldVal){
                    this.isChange = true;
                },
                deep:true
            },
            param(val){
                this.init();
            }
        },
        props: {

        },
        components: {
            relevanceGoods: require('./relevance-goods.vue').default,
            accountTabBox: require('./account-tab-box.vue').default,
            accounts: require('./accounts.vue').default
        }
    }
</script>

