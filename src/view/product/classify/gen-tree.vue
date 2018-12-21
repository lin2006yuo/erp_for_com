<template>
    <div class="p-gen-tree">
        <div class="tree">
            <span v-if="name" :class="{'mouseover':mouseover}" @mouseover.stop="mouseover_event" @mouseout.stop="mouseout_event">
                <i v-if="hasTree" class="before" :class="status" @click="before"></i>
                {{name}}
                <i class="after" @click="after(parent)"></i>
                <div class="right">
                    <span @click.stop="attribute(parent)" class="operate">属性设置</span>
                   &nbsp;&nbsp;  |&nbsp; &nbsp;
                    <span @click.stop="quilty(parent)" class="operate">质检设置</span>
                   &nbsp; &nbsp;  |&nbsp; &nbsp;
                    <span @click.stop="setting(parent)" class="operate">设置</span>
                   &nbsp; &nbsp;  |&nbsp; &nbsp;
                    <span @click.stop="info(parent)" class="operate">详情</span>
                  &nbsp; &nbsp;   |&nbsp; &nbsp;
                    <span @click.stop="delete2(parent)" class="operate">删除</span>

                </div>
            </span>
            <draggable v-model="nodes" @update="change_nodes(parent)">
                <gen-tree @refresh="refresh_out" v-for="(node,nindex) in nodes" :key="`${nindex}-${node}`" v-if="!isClose" :parent="node" :name="get_name(node)" :tree="tree" @add="add" @change-nodes="change_nodes"></gen-tree>
            </draggable>
        </div>
        <edit-dialog v-model="showAttr" :def="def" :attr-id="attrID" :title="title"></edit-dialog>
    </div>
</template>
<style lang="stylus">
    .right{
        box-sizing: border-box;
        display: inline-block;
        float: right;
        margin-right:3%;
        line-height: 26px;
    }

    .p-gen-tree.mytree{
        border-top: none
    }
    .p-gen-tree {
        border-top: 1px solid #D3DCE6;
        padding-left:20px;
        font-size: 1.4rem;
        transition: all 2s;
        .tree{
            >span{
                display: block;
                line-height: 26px;
            }
            i{
                display: inline-block;
                line-height: 26px;
            }
            .before{
                vertical-align: middle;
                margin-left:-30px;
                width:19px;
                height:15px;
                &.close{
                    background:url(../../../assets/file-close.png) no-repeat 0px 0px;
                    background-size: 100% 100%;
                }
                &.open{
                    background:url(../../../assets/file-open.png) no-repeat 0px 0px;
                    background-size: 100% 100%;
                }
            }
            .after{
                width:16px;
                height:16px;
                vertical-align: middle;
                background:url(../../../assets/add.png) no-repeat 0px 0px;
                background-size: 100% 100%;
                line-height: 26px;
            }
            .mouseover{
                background-color: #dde0e5;
            }
        }

    }
    .sub-node-enter{
        opacity: 0;
    }
    .sub-node-leave{
        opacity: 1;
    }

</style>
<script>

    import draggable from '../../../components/drag-drop';
    import {api_add, api_delete, api_edit, api_get_channel_categories, api_get_channel_platform, api_get_channel_classify} from '../../../api/categories';
    export default{
        name:'gen-tree',
        data(){
            return {
                showAttr:false,
                attrID:0,
                def:'',
                showDialog:false,
                isClose:false,
                form:{
                    title:'',
                    pid:'',
                    ch_customs_title:'',
                    en_customs_title:'',
                    platform:[],
                },
                edit:false,
                mouseover:false,

            }
        },
        mounted(){
            this.isClose = this.close;
            this.$on('close',function(close){
                this.isClose = close;
            });
        },
        methods:{
            refresh_out(){
                this.$emit('refresh');
            },
            change_nodes(parent){
                this.$emit('change-nodes',parent);
            },
            before(){
                this.$emit('close',~this.isClose);
            },
            after(index){
                this.$emit('add',index);
            },
            mouseover_event(){
                this.mouseover = true;
            },
            mouseout_event(){
                this.mouseover = false;
            },

            setting(index){
                this.showDialog = true;
                if(this.form.index !== index){
                    this.$http(api_edit, index).then(res=>{
                        this.form = {
                            title:res.title,
                            pid:res.pid,
                            ch_customs_title:res.ch_customs_title || "",
                            en_customs_title:res.en_customs_title || "",
                            index:res.id || "",
                            platform:res.platform || [],
                            status:res.status || 1,
                            keywords:res.keywords || "",
                            description:res.description,
                            code:res.code,
                        };
                    });
                }
                this.edit = true;
            },
            attribute(index){
                if(this.hasTree){
                    this.$message({
                        type:'error',
                        message:'父分类无法带属性'
                    });
                    return;
                }
                this.def = 'attr';
                this.showAttr = true;
                this.attrID = index;
                this.title = this.tree[index].title;
            },
            quilty(index){
                if(this.hasTree){
                    this.$message({
                        type:'error',
                        message:'父分类无法带质检'
                    });
                    return;
                }
                this.def = 'quality';
                this.showAttr = true;
                this.attrID = index;
                this.title = this.tree[index].title;
            },
            delete2(index){
                if(this.nodes.length > 0){
                    this.$message({
                        type:'error',
                        message:"请先删除所有子分类"
                    });
                    return;
                }
                this.$confirm(`确认删除   ${this.tree[index].title}   吗`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete, index).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        let parent = this.tree[this.tree[index].pid] || this.tree;
                        if(parent){
                            let cindex = parent.child_ids.indexOfFun(id => id === index);
                            parent.child_ids.splice(cindex, 1);
                        }
                        this.$delete(this.tree, index);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })

                }).catch(() => {
                });
            },
            info(index){
                this.showDialog = true;
                if(this.form.index !== index){
                    this.$http(api_edit, index).then(res=>{
                        this.form = {
                            title:res.title,
                            pid:res.pid,
                            ch_customs_title:res.ch_customs_title || "",
                            en_customs_title:res.en_customs_title || "",
                            index:res.id || "",
                            platform:res.platform || [],
                            status:res.status || 1,
                            keywords:res.keywords || "",
                            description:res.description,
                            code:res.code,
                        };
                    });
                }
                this.edit = false;
            },

            get_name(node){
                return `${node}-${this.tree[node].title}`;
            },
            add(index){
                if(this.form.index !== index){
                    this.form = {
                        index:0,
                        title:'',
                        pid:index,
                        ch_customs_title:"",
                        en_customs_title:"",
                        platform:[],
                        status:1,
                        keywords:"",
                        description:'',
                        code:'',
                    };
                }
                this.showDialog = true;
                this.edit = true;
            }
        },
        props:{
            tree:{
                required:true,
                type:Object
            },
            parent:{
                type:Number,
                default:0
            },
            close:{
                default(){
                    return false;
                }
            },
            name:{
            },
            index:{}
        },
        computed:{
            status(){
                if(this.isClose){
                    return 'close';
                }else{
                    return 'open'
                }
            },
            hasTree(){
                return this.nodes.length > 0;
            },
            nodes:{
                get(){
                    let child_ids = [];
                    if(this.parent === 0){
                        child_ids = this.tree.child_ids || [];
                    }else{
                        child_ids = this.tree[this.parent].child_ids || [];
                    }
                    return child_ids;
                },
                set(val){
                    if(this.parent === 0){
                        this.tree.child_ids = val;
                    }else{
                        this.tree[this.parent].child_ids = val;
                    }
                }
            },


        },

        components: {
            draggable,
            editForm:require('./edit-form.vue').default,
            editDialog:require('./edit-dialog.vue').default,
        }
    }
</script>
