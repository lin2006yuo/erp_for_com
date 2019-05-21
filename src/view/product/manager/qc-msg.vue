<!--<template>-->
    <!--<el-row class="c-qc-msg">-->
        <!--<div v-if="qualityData.length>0">-->
            <!--<card :label="item.name" v-for="item in qualityData" :key="item.name">-->
                <!--<table class="template" border="1" style="width:100%;text-align: center;" cellspacing="0" cellpadding="0">-->
                    <!--<tr>-->
                        <!--<th v-if="editAble"></th>-->
                        <!--<th>检测项目</th>-->
                        <!--<th>描述</th>-->
                        <!--<th>检具</th>-->
                    <!--</tr>-->
                    <!--<tbody>-->
                    <!--<tr v-for="it in item.items" :key="it.name">-->
                        <!--<td v-if="editAble">-->
                            <!--<el-checkbox v-model="it.enabled"></el-checkbox>-->
                        <!--</td>-->
                        <!--<td>{{it.name}}</td>-->
                        <!--<td>{{it.content}}</td>-->
                        <!--<td>{{it.check_tool}}</td>-->
                    <!--</tr>-->
                    <!--</tbody>-->
                <!--</table>-->
            <!--</card>-->
            <!--<div style="margin:5px 0  0 10px" v-if="!isAdd">-->
                <!--<div v-if="editAble">-->
                    <!--<request-button req-key="qcMsg" @click="keep_">保 存</request-button>-->
                    <!--<el-button size="mini" @click="cancel_">取 消</el-button>-->
                <!--</div>-->
                <!--<el-button size="mini" type="primary" @click="edit">编 辑</el-button>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div v-else style="height:80px;width: 100%;text-align: center">-->
            <!--<span style="display: inline-block;margin-top: 10px">暂无质检项...</span>-->
        <!--</div>-->
    <!--</el-row>-->
<!--</template>-->
<!--<style lang="stylus">-->
    <!--.c-qc-msg {-->

    <!--}-->
<!--</style>-->
<!--<script>-->
    <!--import card from '../../../components/card.vue';-->
    <!--import ulLi from '../../../components/ul-li.vue';-->
    <!--export default{-->
        <!--data(){-->
            <!--return {-->
                <!--checked: false-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--failQualityChecks(){-->
            <!--},-->
            <!--succeQualityChecks(){-->
            <!--},-->
            <!--handleSelectionChange(){-->
            <!--},-->
            <!--keep_(){-->
                <!--this.$emit("keep")-->
            <!--},-->
            <!--cancel_(){-->
                <!--this.$emit("cancel")-->
            <!--},-->
            <!--edit(){-->
                <!--this.$emit("edit")-->
            <!--},-->
        <!--},-->
        <!--props: {-->
            <!--qualityData: {-->
                <!--type: Array-->
            <!--},-->
            <!--editAble: {-->
                <!--required: true,-->
                <!--type: Boolean-->
            <!--},-->
            <!--isAdd: {-->
                <!--default(){-->
                    <!--return false;-->
                <!--}-->
            <!--}-->
        <!--},-->
        <!--components: {-->
            <!--card,-->
            <!--ulLi-->
        <!--}-->
    <!--}-->
<!--</script>-->
<!--暂时不需要-->

<template>
    <div style="margin-top: 20px" class="c-qc-msg">
        <!--<span style="display: inline-block;margin-top: 10px">暂无质检项...</span>-->
        <label>质检信息:</label>
        <el-input type="textarea" :disabled="!editAble" :rows="20" v-model="qualityData[0]"></el-input>
        <div class="block" v-if="editAble">
            <el-button size="mini" type="primary" @click="save">保存</el-button>
            <el-button size="mini" @click="cancel_">取消</el-button>
        </div>
    </div>
</template>

<script>
   export default{
       methods:{
           save(){
                this.$emit('save_qc');
           },
           cancel_(){
                this.$emit("cancel")
           },
       },
       props:{
           qualityData:{},
           editAble: {
              required: true,
               type: Boolean
           },
           isAdd:{
               default(){
                   return false
               }
           }
       }
   }
</script>

<style lang="stylus">
    .c-qc-msg{
        .el-textarea{
            width:90%;
            vertical-align top;
        }
    }
</style>
