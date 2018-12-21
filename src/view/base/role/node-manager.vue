<template>
    <page-dialog class="node-manager"
                 size="full" v-model="show"
                 min-height="600px"
                 tag="红色字体为全局API，无需设置权限"
                 :title="`给角色：${role.name} 设置权限`"
    >
        <el-input class="search-box inline" v-model="search" placeholder="查找..."></el-input>
        <el-radio-group v-model="filter">
            <el-radio :label="0">所有</el-radio>
            <el-radio :label="1">仅显示已有权限的API</el-radio>
            <el-radio :label="2">仅全局API</el-radio>
        </el-radio-group>
        <el-card class="modules-card">
            <el-tabs type="card">
            <el-tab-pane v-for="(module, mtitle) in modules"
                         :key="mtitle"
                         :label="mtitle"
            >
                <node-controller v-for="(controller,ctitle) in module"
                                 :key="ctitle"
                                 :title="ctitle"
                                 :selected="selectes"
                                 @change="changeController(controller,$event)"
                                 :controller="controller"
                >
                    <node v-for="node in controller"
                          :key="node.id"
                          :node="node"
                          :selected="selectes"
                          :relates="relates"
                          @change="changeNode"
                          @setting="setting"
                    ></node>
                </node-controller>
            </el-tab-pane>
            </el-tabs>
            <node-setting v-model="showSetting" :node="node" :roleid="role.id"></node-setting>
        </el-card>
        <span slot="footer">
            <request-button req-key='nodeManager' @click="save">确定</request-button>
            <el-button size="mini" @click.native="cancel">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .node-manager {
        .search-box {
            height: 32px;
            line-height: 32px;
            .el-input__inner {
                height: 100%;
                line-height: 32px;
            }
        }
        .modules-card {
            overflow-y: auto;
        }
        .module {
            padding-bottom: 5px;
            padding-top: 10px;
            width: 100%;
            float: left;
        }
        .controllers {
            padding: 5px;
            padding-left: 20px;
        }
        .controller {
            padding-top: 15px;
            border-bottom: 1px solid rgba(43, 57, 61, 0.38);
        }
        .class {
            border-bottom: 1px solid #bbc3d5;
            padding-top: 15px;
            clear: both;
            width: 100%;
            float: left;
            position: relative;
            .class-name {
                width: 10%;
                display: block;
                float: left;
            }
            .actions {
                float: left;
                width: 90%;
                .action {
                    margin-left: 10px;
                    word-break: break-all;
                    display: inline-block;
                    > span {
                        word-wrap: break-word;
                        display: inline-block;
                    }
                }
            }
        }

    }
</style>
<script>

    import {api_get,api_ignore_vists} from '../../../api/mca-node';
    import {api_get_role_mcas,api_set_role_mcas} from '../../../api/role';
    export default{
        data(){
            return {
                show:this.value,
                filter:0,
                showSetting: false,
                node: {},
                mcanodes: [],
                selectes: {},
                search: '',
            }
        },
        async mounted(){
            let ignore_vists = await this.$http(api_ignore_vists);
            ignore_vists = ignore_vists.map(vist=>{
                return `${vist[0]}::${vist[1]}`;
            });
            let mcanodes = await this.$http(api_get);
            this.mcanodes = mcanodes.map(row =>{
                row.ignore = ignore_vists.includes(row.name);
                return row;
            });
        },
        methods: {
            setting(node){
                this.node = node;
                console.log(node,'node');
                this.showSetting = true;
            },
            action_value(mca){
                return !!this.selectes[mca.id];
            },
            changeNode(nodeid, set = null){
                if(set === null){
                    set = !this.selectes[nodeid];
                }
                if(this.selectes[nodeid] === undefined){
                    this.$set(this.selectes, nodeid, set);
                }else{
                    this.selectes[nodeid] = set;
                }
            },

            changeController(controller, state){
                switch (state){
                    case 1:
                        state = true;
                        break;
                    default:
                        state = false;
                }
                for(const node in controller){
                    if(controller.hasOwnProperty(node)){
                        this.changeNode(controller[node].id, state);
                    }
                }
            },

            is_relate(mca){
                return !!this.relates[mca.name];
            },
            relate_state(mca){
                return !!this.relates[mca.name].find(id=>{
                    return !!this.selectes[id]
                })
            },
            save(){
                let nodes = [];
                for(const id in this.selectes){
                    if(this.selectes.hasOwnProperty(id)){
                        if(this.selectes[id]){
                            nodes.push(id);
                        }
                    }
                }
                this.$http(api_set_role_mcas, this.role.id, nodes).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('nodeManager', false);
                    }, 300)
                })

            },
            cancel(){
                this.show = false;
            }
        },
        computed: {
            modules(){
                let ret = {};
                this.mcanodes.forEach(mca => {
                    if (this.search) {
                        if (mca.title.indexOf(this.search) <= -1
                            && mca.class_title.indexOf(this.search) <= -1
                            && mca.module.indexOf(this.search) <= -1) {
                            return;
                        }
                    }
                    if(this.filter){
                        switch (this.filter){
                            case 1:
                                if(this.is_relate(mca) && this.relate_state(mca)){
                                    break;
                                }
                                if(this.action_value(mca)){
                                    break;
                                }
                                return;
                            case 2:
                                if(!mca.ignore){
                                    return;
                                }
                                break;
                        }
                    }
                    mca.path = `${mca.module} >> ${mca.class_title} >> ${mca.title}`
                    ret[mca.module] = ret[mca.module] || {};
                    ret[mca.module][mca.class_title] = ret[mca.module][mca.class_title] || [];
                    ret[mca.module][mca.class_title].push(mca);
                });
                return ret;
            },
            relates(){
                let relates = {};
                this.mcanodes.forEach(mca=>{
                    mca.relates.forEach(relate=>{
                        const name = `${relate[0]}::${relate[1]}`;
                        relates[name] = relates[name] || [];
                        relates[name].push(mca.id)
                    })
                });
                return relates;
            },
        },
        watch: {
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
            role:{
                deep:true,
                handler(){
                    this.selectes = {};
                    this.$http(api_get_role_mcas, this.role.id).then(res => {
                        let rows = {};
                        res.forEach(row =>{
                            rows[row] = true;
                        });
                        this.selectes = rows;
                    }).catch(code => {
                        console.log(code);
                    })
                }
            }
        },
        props: {
            role: {},
            value:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            nodeModule:require('./node-module.vue').default,
            nodeController:require('./node-controller.vue').default,
            node:require('./node.vue').default,
            nodeSetting: require('./node-setting.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
        }
    }
</script>
