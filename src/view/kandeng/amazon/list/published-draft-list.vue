<template>
    <div class="c-published-draft-list">
        <el-table
            v-resize="{height:41}"
            class="scroll-bar mt-sm"
            :data="tableData.lists"
            v-loading="loading"
            @selection-change="selection_change"
            element-loading-text="玩命加载中..."
            highlight-current-row>
            <el-table-column type="selection"></el-table-column>
            <el-table-column :label="$t('ymx-list.mImage')" inline-template width="90px">
                <div style="height:60px">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img v-lazy="get_path(row.main_url,'_200x200.',row.base_url)"
                             width="200px" height="200px">
                        <span slot="reference">
                            <img v-lazy="get_path(row.main_url,'_60x60.',row.base_url)"
                                 @click="show_big_picture(row)"
                                 v-if="row.main_url" height="60px" width="60px"
                                 style="border:none;vertical-align: middle">
                        </span>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.localspu')" prop="spu"></el-table-column>
            <el-table-column :label="$t('ymx-list.upTitle')" inline-template>
                <div>
                    <ui-tip :content="row.title" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column :label="$t('ymx-list.acc')" prop="codes"></el-table-column>
            <el-table-column :label="$t('ymx-list.cTime')" prop="create_time"></el-table-column>
            <el-table-column :label="$t('ymx-list.operat')" inline-template>
                <trends-select class="inline" type="primary"
                               :selects="comOperate" @trigger="check(row,$event)"></trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
        <blowup-image v-model="showBigPicture" :img-path="bigImagePath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_amazon_draft_delete,url_amazon_draft_delete} from '@/api/amazon-publish-list';
    import {api_edit_amazon_draft,url_edit_amazon_draft,api_amazon_field} from '@/api/amazon-publish-info';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {get_product_attribute,get_edit_data} from '../info/info-public-methods';
    export default {
        permission:{
            url_amazon_draft_delete,
            url_edit_amazon_draft
        },
        data() {
            return {
                objOfCategory:{},
                objOfCommonAtt:{},
                objOfProductId:{},
                allRuleAttr:{},
                bigImagePath:'',
                showBigPicture:false,
                operateList:[
                    {label:this.$t('ymx-list.edit'),value:"1",apis:url_edit_amazon_draft,action:function(row){
                        let params = {
                            spu: row.spu,
                            id:row.id,
                            curPage:'draft',//未刊登
                        };
                        this.$open(`/kandeng/amazon/info?id=${row.id}`, params);
                    }},
                    {label:this.$t('ymx-list.del'),value:"2",apis:url_amazon_draft_delete,action:function(row){
                        this.delete_listing(row)
                    }}
                ]
            }
        },
        filters:{
            filterImage(val){
                console.log(val);
            },
        },
        methods:{
            get_path,
            get_product_attribute,
            get_edit_data,
            selection_change(selection){
                this.$emit('selection-change',selection);
            },
            size_change(pageSize){
                this.$emit('size-change',pageSize);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
            check(data,val){
                val.action.call(this,data)
            },
            delete_listing(row){
                this.$confirm(`${this.$t('ymx-list.delConfirm')},${this.$t('common.confirm')}`,this.$t('common.confirm'),{
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    let params = {
                        draft_ids:row.id,
                    };
                    this.$http(api_amazon_draft_delete,params).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        let index = this.tableData.lists.findIndex(item=>item.id===row.id);
                        if(index>-1)this.tableData.lists.splice(index,1);
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                }).catch(code=>{
                    this.$message({
                        type:"info",
                        message:this.$t('ymx-list.cancelTip')
                    });
                })
            },
            show_big_picture(row){
                this.showBigPicture = true;
                this.bigImagePath = this.get_path(row.main_url,'_500x500.',row.base_url);
            },
            /**为完成草稿箱所调取的接口 Start
             * */
            //根据站点和spu,调取原始数据
            async get_all_rule_attr(curRow,spu){//后端给我的字段和规则
                await this.$http(api_amazon_field,{site:curRow.site,spu:spu}).then(res=>{
                    res.descript.forEach(row=>{
                        row.field.forEach(res=>{
                            if(res.name ==='Description'){
                                res.value = `<p>${res.value}</p>`
                            }
                        })
                    });
                    res.sku.forEach(row=>{
                        let objValue = {
                            type:'check',
                            value:true,
                        };
                        this.$set(row,'check',objValue);
                        row['ProductIDType']&&!row['ProductIDType'].value&&(row['ProductIDType'].value='UPC')
                    });
                    res.img.forEach(row=>{
                        if(row.data.images&&row.data.images.length>0){
                            row.data.images.forEach(it=>{
                                this.$set(it,'isSwatch',false);
                            });
                            row.data.images[0].isSwatch = true;
                        }
                    });
                    this.allRuleAttr[`${curRow.account_id}-${curRow.site}`] = res;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                    this.$close('/kandeng/amazon/info');
                })
            },
            //根据站点 获取分类模板属性
            async get_category(row){
                let type = 1;
                const res = await this.get_product_attribute(type,row.site);
                this.objOfCategory[`${row.account_id}-${row.site}`] = clone(res);
            },
            //根据站点获取 产品分类属性
            async get_attribute(curRow){
                let productType = 2;
                await this.get_product_attribute(productType,curRow.site).then(id=>{
                    /*初始化产品默认模板属性
                    * */
                    this.objOfProductId[`${curRow.account_id}-${curRow.site}`] =id?id:0;
                    if(!id)return this.$message({type:"warning",message:`【${curRow.code}】${this.$t('ymx-list.acc')}，${this.$t('ymx-list.noTempTip')}`});
                    this.get_edit_data(productType,curRow.site,id).then(res=>{
                        if(res.product){
                            res.product.attrs.forEach(row=>{
                                let restriction = [];
                                this.$set(row,'require',row.required);
                                this.$set(row,'type',2);
                                this.$set(row,'site',curRow.site);
                                this.$set(row,'value','');
                                this.$set(row,'unitValue','');
                                if(!!row.attribute)restriction = row.attribute.restriction;
                                this.$set(row,'restriction',restriction);
                            });
                            this.objOfCommonAtt[`${curRow.account_id}-${curRow.site}`] = res.product.attrs;
                        }else{
                            console.log('分类模板暂无数据');
                        }
                    });
                });
            },
            /**为完成草稿箱所调取的接口 End
             * */
        },
        computed:{
            comOperate(){
                let list = this.operateList.filter(row=>{
                    return this.$hasPermission(row.apis)
                });
                return list;
            },
        },
        props:{
            /**表格数据
             * */
            tableData:{
                type:Object,
                required:true
            },
            loading:{
                type:Boolean,
                required:true
            },
            /*用于查找site和account_id
            * */
            accountList:{
                type:Array,
                required:true
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            trendsSelect:require('@/components/trends-select.vue').default,
            blowupImage:require('@/components/blowup-image.vue').default,
        }
    }
</script>