<template>
    <div>
        <el-input class="inline width-200" style="vertical-align: top" v-model="categoryCode" :placeholder="$t('ymx-detail.cateCodes')"
                  @blur="search_code"></el-input>
        <el-button type="primary" style="vertical-align: top"
                   size="mini" @click.native="choice_category_first">{{$t('ymx-detail.proCate1')}}</el-button>
        <el-button type="primary" style="vertical-align: top"
                   :disabled="!form.category_name"
                   size="mini" @click.native="choice_category_second">{{$t('ymx-detail.proCate2')}}</el-button>
        <category-dialog ref="category" v-model="categoryDialog"
                         channel="amazon" :site="site"
                         @submit="submit"></category-dialog>
        <!--<p style="color:#008BCE">{{category_id || category_id_prop}} <span v-show="!!(categoryShow || categoryName)">->></span> {{categoryShow || categoryName}}</p>-->
        <p style="color:#008BCE" v-if="form.category_name">{{form.category_name}}
            <span class="ml-sm delete-icon"
                  v-if="!form.category_name2"
                  @click="delete_category('first')"></span>
        </p>
        <p style="color:#008BCE" v-if="form.category_name2">{{form.category_name2}} <span class="ml-sm delete-icon" @click="delete_category('second')"></span></p>
    </div>
</template>

<style lang="stylus">
    .width-200{
        width: 200px;
    }
</style>
<script>
    import {api_product_search} from '../../../../../api/amazon-publish-info'
    export default{
        data(){
            return {
                categoryCode: '',
                categoryDialog: false,
                categoryShow: '',
                category_id:'',
                curCategory:'',
            }
        },
        methods: {
            delete_category(name){
                if(name==='first'){
                    this.form.category_name = '';
                    this.form.category_id = '';
                }else{
                    this.form.category_name2 = '';
                }
                this.$emit('delete-category',name);
            },
            search_code(){
                if (this.site === '') {
                    this.$message({
                        type: "error",
                        message: '请先选择站点'
                    });
                }else {
                    if(this.categoryCode === ''){return}
                    this.curCategory = 'first';
                    this.$http(api_product_search, {site: this.site,keywords: this.categoryCode}).then(res => {
                        if(res.data.length <= 0)return this.$message({type: 'info',message: '该分类编码无效'});
                        this.submit(res.data[0]);
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message || code
                        })
                    })
                }
            },
            choice_category_first(){
                if (this.site === '') {
                    this.$message({
                        type: "error",
                        message: '请先选择站点'
                    });
                    return
                }
                this.categoryDialog = true;
                this.curCategory = 'first'
            },
            choice_category_second(){
                if (this.site === ''||!this.form.category_name) {
                    this.$message({
                        type: "warning",
                        message: '站点未选择 或 产品分类1未选择'
                    });
                    return
                }
                this.categoryDialog = true;
                this.curCategory = 'second'
            },
            submit(val,val2){
                let category_id = '';
                let category_name = '';
                if(val instanceof Array && val.length > 0){
                    let arr = val.map(item=>{
                       return item.category_name || item.category_path_name
                    });
                    category_name = arr.join('>>');
                    category_id = val[val.length-1].category_id;
                    this.category_id = val[val.length-1].category_id;
                }else if(val instanceof Object){
                    category_name = val.category_name || val.category_path_name;
                    category_id = val.category_id;
                    this.category_id = val.category_id;
                }
                let detailData = val2?val2:val;
                if(this.curCategory==='first'){
                    this.form.category_name = `${category_id}->>${category_name}`;
                    this.form.category_id = category_id;
                }else{
                    this.form.category_name2 = `${category_id}->>${category_name}`;
                }
                this.$emit('submit',category_id,detailData,this.curCategory);
                this.categoryDialog = false;
            }
        },
        computed: {},
        watch: {},
        props: {
            site: {
                required: true,
                type: String
            },
            form:{},
        },
        components: {
            categoryDialog: require('../../../ebay/category-dialog.vue').default
        }
    }
</script>

