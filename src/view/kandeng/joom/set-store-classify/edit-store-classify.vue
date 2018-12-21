<template>
    <page-dialog class="p-template-set" :title="label" v-model="visible" size="large" :close-on-click-modal="false">
        <div style="text-align: center;margin-bottom:10px; ">
            <label>平台账号：</label>
            <el-select class="inline width-lg"
                       v-model="joom_account_id"
                       filterable
                       clearable
                       @change="select_account">
                <el-option v-for="(item, index) in joom_account" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <div style="text-align: center;margin-bottom:10px; ">
            <label>平台店铺：</label>
            <el-select class="inline width-lg"
                       v-model="joom_shop_id"
                       filterable
                       clearable
                       :disabled="storeIsDisable"
                       placeholder="请先选择账号">
                <el-option v-for="(item, index) in joom_store" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>

        <div style="text-align: left;margin-bottom: 10px;">
            <el-button size="mini" type="primary" @click="packUp">全部收起</el-button>
            <el-button size="mini" type="primary" @click="spread">全部展开</el-button>
        </div>

        <div>
            <el-tree style="height: 500px;overflow: auto" :data="category_tree" :prop="defaultProps" node-key="value"
                     show-checkbox
                     @check-change="check_change" :default-checked-keys="check">

            </el-tree>
        </div>

        <div style="float: right; margin-top: 10px;">
            <el-button type="primary" size="mini" @click="save">确定</el-button>
            <el-button size="mini" @click="visible=false">取消</el-button>
        </div>

    </page-dialog>
</template>

<style lang="stylus">

</style>
<script>
    import {api_get_joom_store, api_joom_save_category} from '../../../../api/joom-set-classify'

    export default{
        data(){
            return {
                label:'添加',
                visible: false,
                joom_store: [],
                joom_account_id: '',
                joom_shop_id: '',
                defaultProps: {
                    label: 'label',
                    children: 'children',
                },
                check: []
            }

        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){

            },
            save(){
                if (this.joom_account_id === '') {
                    this.$message({
                        type: 'info',
                        message: "账号不能为空"
                    });
                    return
                }
                if (this.joom_shop_id === '') {
                    this.$message({
                        type: 'info',
                        message: "店铺不能为空"
                    });
                    return
                }
                if (this.check.length <= 0) {
                    this.$message({
                        type: 'info',
                        message: "分类必选"
                    });
                    return
                }
                let obj = {
                    joom_account_id: this.joom_account_id,
                    joom_shop_id: this.joom_shop_id,
                    category_id: this.check.join(','),
                    update: this.update
                };

                return this.$http(api_joom_save_category, obj).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                    this.$emit('init');
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            check_change(data, checked, indeterminate){
                if (checked) {
                    if (data.children && data.children.length === 0 || !data.children) {
                        this.check.push(data.value);
                    }
                } else {
                    let index = this.check.findIndex(item => {
                        return item === data.value
                    });
                    if (index !== -1) {
                        this.check.splice(index, 1);
                    }
                }

            },
            select_account(val){
                if (val === '') {
                    this.shopList = [];
                } else {
                    this.get_joom_store();
                }
                this.joom_shop_id = '';
            },
            get_joom_store(){
                this.$http(api_get_joom_store, {joom_account_id:this.joom_account_id}).then(res => {
                    this.joom_store = [{label: '全部', value: ''}, ...res.data];
                })
            },
            packUp(){
                let domArray = document.getElementsByClassName('el-tree-node__children');
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'none';
                }
            },
            spread(){
                let domArray = document.getElementsByClassName('el-tree-node__children')
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'block';
                }
            }
        },
        computed: {
            storeIsDisable(){
                return this.joom_account_id === '';
            }
        },
        watch: {
            value(val){
                this.visible = val;
                if(val){
                    this.joom_account_id = this.editObj.joom_account_id;
                    if(this.joom_account_id !== ''){
                        this.get_joom_store();
                    }
                    this.joom_shop_id = this.editObj.joom_shop_id;
                    this.check = this.editObj.category_id;
                    this.label= this.editObj.label;
                }
            },
            visible(val){
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            joom_account: {},
            category_tree: {},
            editObj:{},
            update:{}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
        }
    }
</script>

