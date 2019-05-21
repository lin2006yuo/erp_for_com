<template>
    <div class="c-sale-detail">
        <el-tabs class="tabs-style" v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="Payment" name="payment">
                <html-editor  v-if="activeName==='payment'" class="editor-height" editid="payment" v-model="form.payment" ></html-editor>
            </el-tab-pane>
            <el-tab-pane label="Delivery details" name="delivery">
                <html-editor  v-if="activeName==='delivery'" class="editor-height" editid="delivery" v-model="form.delivery_detail" ></html-editor>
            </el-tab-pane>
            <el-tab-pane label="Terms of sales" name="sales">
                <html-editor v-if="activeName==='sales'" class="editor-height" editid="sales" v-model="form.terms_of_sales"></html-editor>
            </el-tab-pane>
            <el-tab-pane label="About us" name="about" >
                <html-editor v-if="activeName==='about'" class="editor-height" editid="about" v-model="form.about_us"></html-editor>
            </el-tab-pane>
            <el-tab-pane label="Contace us" name="contace" >
                <html-editor v-if="activeName==='contace'" class="editor-height" editid="contace" v-model="form.contact_us"></html-editor>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="stylus">
    .c-sale-detail{
        .editor-height{
             height:400px !important;
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                activeName:"payment",
            }
        },
        methods:{
            handleClick(val){

            },
        },
        props:{
            form:{},
        },
        components: {
            HtmlEditor:require('../../../../components/html-editor.vue').default,
        }
    }
</script>