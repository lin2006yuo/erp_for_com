<template>
    <page-dialog size="small" v-model="dialog" :close-on-click-modal="false" :title="title">
        <div class="check_edit" style="text-align: center;margin:20px 0px;">
            <label-item label="采购员：" v-if="title.includes('绑定的采购员')">
                <!--<el-select  v-model="copypurchaser" placeholder="请选择/输入" >-->
                    <!--<el-option v-for="res in purchasing"-->
                               <!--:label="res.realname"-->
                               <!--:value="res.id"-->
                               <!--:key="res.id"></el-option>-->
                <!--</el-select>-->
                <super-select v-model="copypurchaser"
                              storageKey="purchasing"
                              :options="purchasing"></super-select>
            </label-item>
            <label-item label="SKU查重文员："  v-else>
                <super-select v-model="copypurchaser"
                              storageKey="purchasing2"
                              :options="purchasing"></super-select>
                <!--<el-select  v-model="copypurchaser" filterable clearable  placeholder="请选择/输入">-->
                    <!--<el-option v-for="item in purchasing"-->
                               <!--:label="item.realname"-->
                               <!--:value="item.id"-->
                               <!--:key="item.id"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
            </label-item>
            <div slot="footer" v-if="title.includes('修改')" class="foot">
                <el-button @click="sure" type="primary" size="mini">确定</el-button>
                <el-button @click="channel" size="mini">取消</el-button>
            </div>
        </div>
    </page-dialog>
</template>

<script>
    import {api_edit_categories,api_edit_skuManger} from '../../../api/sort-bind-purchasers';
    export default {
        data() {
            return {
                dialog: this.value,
                list:[],
                copypurchaser:this.purchaser,
            }
        },
        methods: {
            close(){

            },
            sure() {
                let id = this.resId;
                let purchaser_id=this.copypurchaser;
                if(this.title.includes('绑定的采购员')){
                    console.log("修改前",purchaser_id);
                    this.$http(api_edit_categories,id,{purchaser_id:purchaser_id}).then(res=>{
                        // setTimeout(()=>{
                        //     this.dialog= false;
                        //      this.copypurchaser = ''
                        // },1000);
                        this.dialog= false;
                        this.$message({
                            type: 'success',
                            message: res.message || res,
                            duration:1000
                        });
                        this.$emit('search')
                    })
                }else{
                    this.$http(api_edit_skuManger,id,{sku_checking_id:purchaser_id}).then(res=>{
                        // setTimeout(()=>{
                        //     this.dialog= false;
                        //      this.copypurchaser = ''
                        // },1000);
                        this.dialog= false;
                        this.$message({
                            type: 'success',
                            message: res.message || res,
                            duration:1000
                        });
                        this.$emit('search')
                    })
                }

            },
            channel(){
                this.dialog=false;
                this.copypurchaser = this.purchaser;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
                this.copypurchaser = this.purchaser;
            },
            value(val){
                this.dialog = val;

            },
            purchaser(val){
                this.copypurchaser = val;
            }
        },
        props:{
          purchaser:{},
          title:{},
          value:{},
          resId:{},
          purchasing:{},
          purchaser_id:{},
          type:{},
          skuManager:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item').default,
        }
    }
</script>

<style scoped>
.foot{
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>
