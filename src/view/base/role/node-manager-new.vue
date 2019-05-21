<template>
    <div class="node-manager">
        <el-input class="search-box inline" v-model="search" placeholder="查找..."></el-input>
        <el-radio-group v-model="filter">
            <el-radio :label="0">所有</el-radio>
            <el-radio :label="1">仅显示已有权限的API</el-radio>
            <el-radio :label="2">仅全局API</el-radio>
        </el-radio-group>
        <el-card class="modules-card">
            <label-panel class="module" v-for="(mcas, mname) in modules" :key="mname">
            <span slot="label">
                {{mname}}
            </span>
                <div class="class" v-for="(mcaa , cname) in mcas"
                     :key="cname"
                     v-if="mcaa.classify !== '登录'">
                    <check-status :value="controller_value(mcaa)"
                                  @input="(val)=>{click_controller_value(mcaa, val)}"
                                  class="class-name">{{mcaa.classify}}
                    </check-status>
                    <span class="actions">
                    <span class="action" v-for="mca in mcaa.data"
                          :key="mca.title"
                    >
                        <template v-if="is_ignore_vist(mca)">
                            <el-checkbox :value="true" :disabled="true">
                                </el-checkbox>
                            <span class="link red" title="全局API" @click="clickSetting(mca)">{{mca.title}}</span>
                        </template>
                        <template v-else>
                            <template v-if="is_relate(mca)">
                                <el-checkbox :disabled="relate_state(mca)"
                                             :title="relate_state(mca) ? '被关联API,无法取消' : ''"
                                             :value="relate_state(mca) || action_value(mca)"
                                             @change="action_change(mca)">
                                </el-checkbox>
                            <span class="link" v-if="action_value(mca)"
                                  @click="clickSetting(mca)">{{mca.title}}</span>
                            <span v-else>{{mca.title}}</span>
                            </template>
                            <template v-else>
                                <el-checkbox :value="action_value(mca)"
                                             @change="action_change(mca)">
                                </el-checkbox>
                            <span class="link" v-if="action_value(mca)"
                                  @click="clickSetting(mca)">{{mca.title}}</span>
                            <span v-else>{{mca.title}}</span>
                            </template>
                        </template>
                </span>
                </span>
                </div>
            </label-panel>
        </el-card>
        <node-setting v-model="showSetting"
                      :node="node"
                      :roleid="roleid">
        </node-setting>
    </div>
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
            height: 480px;
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
    import {api_get_role_mcas} from '../../../api/role';
    export default{
        data(){
            return {
                filter:0,
                showSetting: false,
                node: {},
                mcanodes: [],
                ignore_vists: [],
                selectes: [],
                search: '',
            }
        },
        mounted(){
            this.$http(api_get).then(res => {
                this.mcanodes = res;
            });
            this.$http(api_ignore_vists).then(res=>{
                this.ignore_vists = res;
            });
            this.$http(api_get_role_mcas, this.roleid).then(res => {
                this.selectes = res;
            }).catch(code => {
                console.log(code);
            })
        },
        methods: {
            module_value(){

            },
            click_module_value(mcas, val){

            },
            controller_value(mcaa){
                const check = mcaa.data.find(row => this.action_value(row));
                const notcheck = mcaa.data.find(row => !this.action_value(row));
                if (check && notcheck) return 2;
                if (check) return 0;
                return 1;
            },
            click_controller_value(mcas, val){
                switch (val) {
                    case 0://全选
                        mcas.data.forEach(row => {
                            this.action_change(row);
                        });
                        break;
                    case 1:
                        mcas.data.forEach(row => {
                            this.action_change(row, true)
                        });
                        break;
                    case 2:
                        mcas.data.forEach(row => {
                            this.action_change(row, false);
                        });
                        break;

                }
            },
            action_value(mca){
                return this.selectes.indexOf(mca.id) >= 0;
            },
            action_change(mca, set){
                let i = -1;
                if ((i = this.selectes.indexOf(mca.id)) >= 0) {
                    this.selectes.splice(i, 1);
                } else {
                    this.selectes.push(mca.id);
                }
            },
            clickSetting(nodeid){
                this.node = nodeid;
                this.showSetting = true;
            },
            is_relate(mca){
                return !!this.relates[mca.name];
            },
            relate_state(mca){
                console.log(mca.name, mca);
                return !!this.relates[mca.name].find(id=>{
                    return this.selectes.includes(id)
                })
            },
            is_ignore_vist(mca){
                return this.ignore_vists2.includes(mca.name);
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
                                if(!this.is_ignore_vist(mca)){
                                    return;
                                }
                                break;
                        }
                    }
                    ret[mca.module] = ret[mca.module] || {};
                    ret[mca.module][mca.class_title] = ret[mca.module][mca.class_title] || {
                            classify: mca.class_title,
                            data: []
                        };
                    ret[mca.module][mca.class_title].data.push(mca);
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
            ignore_vists2(){
                return this.ignore_vists.map(vist=>{
                    return `${vist[0]}::${vist[1]}`;
                });

            }
        },
        watch: {},
        props: {
            roleid: {}
        },
        components: {
            nodeSetting: require('./node-setting.vue').default,
            labelPanel: require('../../../components/label-panel.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            checkStatus: require('../../../components/check-status.vue').default,
        }
    }
</script>