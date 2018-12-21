<template>
    <table class="template">
        <tr>
            <th>taskID</th>
            <th>worker</th>
            <th>update</th>
        </tr>
        <tr v-for="task in tasks" :key="task.id">
            <td>{{task.id}}</td>
            <td>{{task.task|taskFilter}}</td>
            <td>{{task.time|fmsdatetime}}</td>
        </tr>
    </table>
</template>
<style lang="stylus">

</style>
<script>

    import websocket from '../../../mixins/websocket';
    export default{
        mixins:[websocket],
        data(){
            return{
                tasks:{}
            }
        },
        filters:{
            taskFilter(task){
                return task;
            }
        },
        mounted(){
            console.log(`mounted!!!!`);
            this.$subscibe('taskdoing', (doing) =>{
                console.log(doing);
                switch (doing.direction){
                    case 1:
                        this.$set(this.tasks, doing.id, doing);
                        break;
                    case 0:
                        this.$delete(this.tasks, doing.id);
                        break;
                }
                this.$forceUpdate();
            });
        },
        components:{

        }
    }
</script>