<template>
    <span class="action">
        <template v-if="node.ignore">
            <el-checkbox :value="true" :disabled="true">
                </el-checkbox>
            <span class="link red"
                  title="全局API"
                  @click="clickSetting">{{node.title}}</span>
        </template>
        <template v-else>
                <template v-if="is_relate">
                    <el-checkbox :disabled="relate_state"
                                 :title="relate_state ? '被关联API,无法取消' : ''"
                                 :value="relate_state || action_value"
                                 @input="action_change">
                    </el-checkbox>
                <span class="link" v-if="action_value"
                      @click="clickSetting">
                    {{node.title}}
                </span>
                <span v-else>{{node.title}}</span>
                </template>
                <template v-else>
                    <el-checkbox :value="action_value"
                                 @input="action_change">
                    </el-checkbox>
                <span class="link" v-if="action_value"
                      @click="clickSetting">{{node.title}}</span>
                <span v-else>{{node.title}}</span>
                </template>
            </template>
    </span>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            action_change(value){
                this.$emit('change', this.node.id, value);
            },
            clickSetting(){
                this.$emit('setting', this.node);
            },
        },
        computed:{
            is_relate(){
                return !!this.relates[this.node.name];
            },
            relate_state(){
                return !!this.relates[this.node.name].find(id=>{
                    return !!this.selected[id]
                })
            },
            action_value(){
                return !!this.selected[this.node.id];
            }
        },
        props:{
            relates:{},
            node:{},
            selected:{}
        },
        components: {}
    }
</script>