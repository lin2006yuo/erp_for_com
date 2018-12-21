<template>
    <page-dialog :title="`分类：${title}`" v-model="show" size="large"  :close-on-click-modal="false"  >
        <ui-tabs class="row" v-model="name" type="card" @tab-click="handleClick">
            <ui-tab-item label="属性设置" name="attr">
                <edit-attr ref="attr" :attr-id="attrId"></edit-attr>
            </ui-tab-item>
            <ui-tab-item label="质检设置" name="quality">
                <edit-quality ref="quality" :attr-id="attrId"></edit-quality>
            </ui-tab-item>
        </ui-tabs>
    </page-dialog>
</template>
<style lang="stylus">
    .edit-attr{
        .label-width{
            width:50px;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .group{
            border:1px solid #99A9BF;
            border-radius: 5px;
            padding:5px;
            margin-top: 3px;
            .group-label{
                padding-left:15px;
                font-size:14px;
                line-height: 26px;
                font-weight:600;
            }
            .attrs{
                padding:0 10px 10px 15px;
                border:1px solid #D3DCE6;
                border-radius: 3px;
                min-height: 26px;
                .attr{
                    margin-top:15px;
                }
            }
        }
        .el-pagination{
            text-align: right;
        }
    }

    .attr-filter{
        width:100%;
        height:100%;
        margin-top: 5px;
        max-height: 600px;
        border: 1px solid #D3DCE6;
        border-radius: 5px;
        li{
            line-height: 26px;
            padding-left:15px;
            font-size: 1.2rem;
            cursor: pointer;
            &.use{
                color: #59c448;
            }
        }
    }
    .bor{
        border:none
    }
    .attr-footer{
        text-align: center;
    }

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
                name:this.def
            }
        },
        methods:{
            handleClick(tab){
                let ref = this.$refs[tab.name];
//                ref.reload.call(ref);
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit("input", val);
            },
            def(val){
                this.name = val;
            }
        },
        props:{
            value:{},
            attrId:{},
            def:{},
            title:{}
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiTabs:require('../../../components/ui-tabs.js').default,
            uiTabItem:require('../../../components/ui-tab-item.vue').default,
            editAttr:require('./edit-attr.vue').default,
            editQuality:require('./edit-quality.vue').default,
        }
    }
</script>
