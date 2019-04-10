<template>
    <el-dropdown size="mini" split-button type="primary" @command="command" @click="current_operate" class="personcenter inline">
        {{currentOperate}}
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in handles"
                              :key="item[keys] || item.value"
                              :command="item.label">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                switchHandle:0,
                commandCurrent:{}
            }
        },
        mounted(){
            this.commandCurrent = this.handles[0] || {};
        },
        methods:{
            command(command){
                command = this.handles.find(row=>row.label===command);
                this.commandCurrent = command;
                if(this.trigger === 'change'){
                    this.change_operate()
                }
            },
            current_operate(){
                let action = this.commandCurrent.action || this.action ;
                if(action){
                    action.call(this._renderContext, this.commandCurrent);
                }
            },
            change_operate() {
                let change = this.commandCurrent.action || this.change ;
                if(change){
                    change.call(this._renderContext, this.commandCurrent);
                }
            }
        },
        computed:{
            currentOperate(){
                return this.commandCurrent.label || "--空--";
            }
        },
        watch:{
            handles(){
                this.commandCurrent = this.handles[0] || {};
            }
        },
        props:{
            //key未保留字
            keys: {
                required:true
            },
            handles:{
                required:true,
                type:Array
            },
            action:{
                required:false,
                type:Function
            },
            trigger:{
                type:String,
                default(){
                    return 'change';
                }
            },
            change: {
                required:false,
                type:Function
            }
        },
        components:{

        }
    }
</script>