<template>
    <page-dialog :title="$t('ymx-list.descDetail')" v-model="visible" size="large" :close-on-click-modal="false">
        <only-blod-edit v-model="description" editid="11"></only-blod-edit>
        <label>{{$t('ymx-list.find')}}</label>
        <el-input class="inline" v-model="text_find"></el-input>
        <label>{{$t('ymx-list.replace')}}</label>
        <el-input class="inline" v-model="text_replace"></el-input>
        <el-button type="primary" size="mini" @click="description_replace">{{$t('ymx-list.replace2')}}</el-button>
        <div slot="footer">
            <el-button size="mini" type="primary" @click="submit_detail">{{$t('common.confirm')}}</el-button>
            <el-button size="mini" @click="visible = false">{{$t('common.cancel')}}</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">

</style>
<script>
    import {api_get_detail, api_edit_listing} from '../../../../api/amazon-publish-list'
    export default{
        data(){
            return {
                visible: false,
                description:'',
                oldValue:'',
                text_find:'',
                text_replace:''
            }
        },
        methods: {
            init(){
                this.$http(api_get_detail,this.id).then(res=>{
                    if(!res){
                        this.oldValue = '';
                        this.description = "<p></p>";
                    }
                    this.oldValue = res.description;
                    this.description = "<p>"+ res.description.replace(/\r/g,'<br/>') +"</p>";
                })
            },
            submit_detail(){
                let str = this.description.replace(/<p>/g, '');
                str = str.replace(/<\/p>/g, '<br/>');
                let parameter = {
                    type:'description',
                    data:[
                        {
                            "amazon_listing_id":this.amazonListingId,
                            "account_id":this.accountId,
                            "new_value":str,
                            "old_value":this.oldValue
                        }
                    ]
                };
                console.log('parameter',parameter);
                this.$http(api_edit_listing, parameter).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            description_replace(){
                if(!this.text_find.trim()){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.enterSearch')
                    });
                    return
                }
                let reg = new RegExp(this.text_find,'g');
                this.description = this.description.replace(reg, this.text_replace);
            }
        },
        computed: {},
        watch: {
            value(val){
                this.visible = val;
                if(val){
                    this.init();
                }
            },
            visible(val){
                this.$emit('input', val)
            }
        },
        props: {
            value:{},
            id:{},
            amazonListingId:{},
            accountId:{}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            onlyBlodEdit: require('../amazon-plan-publish/only-blod-edit.vue').default
        }
    }
</script>

