<template>
    <page-dialog :title="action.title"
                 size="large"
                 @open="open"
                 class="p-shipping-address-setting"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-tabs v-model="activeName" @tab-click="handle_click">
            <el-tab-pane v-for="(row, i) in personGroup" :label="row.label+'信息'" :name="row.name" :key="i" :disabled="action.type ? true : false">
                <el-form ref="form" label-width="150px" class="mt-sm">
                    <el-col :span="24">
                        <el-form-item label="名称：" required>
                            <ui-input v-model="addressName" style="width: 50%" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="item.span||12" v-for="(item,index) in listData" :key="index">
                        <el-form-item :label="item.label+'：'" required>
                            <ui-input v-model="item.value" :style="item.span ? 'width: 70%' : 'display: inline-block;'" :edit="editable" :type="item.type" @blur="number_test(item)"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="save"
                       v-if="action.operation !== 'look'">保存</el-button>
            <el-button size="mini"
                       @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                visible: false,
                personGroup:[
                    {label: '寄件人', name: "1"},
                    {label: '揽收人', name: "2"},
                    {label: '退货人', name: "3"}
                ],
                activeName: "1",
                listData: [],
                addressName: ''
            }
        },
        methods: {
            open(){
                //新增地址可以切换地址类型，查看或者修改的时候，地址类型不可切换
                if(this.action.type){
                    this.activeName = String(this.action.type);
                }
                if(this.action.operation === 'add'){
                    this.activeName = '1';
                    this.addressName = '';
                    switch(Number(this.activeName)){
                        case 1:
                            this.listData = [
                                {label: 'Name', value: '', name: 'name'},
                                {label: 'Company', value: '', name: 'company'},
                                {label: 'Country', value: '', name: 'country'},
                                {label: 'State', value: '', name: 'state'},
                                {label: 'City', value: '', name: 'city'},
                                {label: 'District', value: '', name: 'district'},
                                {label: 'Street', value: '', name: 'street', span: 24},
                                {label: 'Zip Code', value: '', name: 'zipcode', type: 'number'},
                                {label: 'Mobile', value: '', name: 'mobile', type: 'number'},
                                {label: 'Phone', value: '', name: 'phone', type: 'number'},
                                {label: 'Email', value: '', name: 'email'}
                            ];
                            break;
                        case 2:
                            this.listData = [
                                {label: '揽收人名称', value: '', name: 'name'},
                                {label: '揽收人公司', value: '', name: 'company'},
                                {label: '揽收人国家', value: '', name: 'country'},
                                {label: '揽收人省/州', value: '', name: 'state'},
                                {label: '揽收人城市', value: '', name: 'city'},
                                {label: '揽收人地区', value: '', name: 'district'},
                                {label: '揽收人街道', value: '', name: 'street'},
                                {label: '揽收人邮编', value: '', name: 'zipcode', type: 'number'},
                                {label: '揽收人电话', value: '', name: 'mobile', type: 'number'},
                                {label: '揽收人邮箱', value: '', name: 'email'}
                            ];
                            break;
                        case 3:
                            this.listData = [
                                {label: '退货人名称', value: '', name: 'name'},
                                {label: '退货人公司', value: '', name: 'company'},
                                {label: '退货人国家', value: '', name: 'country'},
                                {label: '退货人省/州', value: '', name: 'state'},
                                {label: '退货人城市', value: '', name: 'city'},
                                {label: '退货人地区', value: '', name: 'district'},
                                {label: '退货人街道', value: '', name: 'street'},
                                {label: '退货人邮编', value: '', name: 'zipcode', type: 'number'},
                                {label: '退货人电话', value: '', name: 'mobile', type: 'number'},
                                {label: '退货人邮箱', value: '', name: 'email'}
                            ];
                            break
                    }
                }else{
                    let data = this.formData;
                    this.addressName = this.formData.address_name;
                    switch(Number(this.activeName)){
                        case 1:
                            this.listData = [
                                {label: 'Name', value: data.name, name: 'name'},
                                {label: 'Company', value: data.company, name: 'company'},
                                {label: 'Country', value: data.country, name: 'country'},
                                {label: 'State', value: data.state, name: 'state'},
                                {label: 'City', value: data.city, name: 'city'},
                                {label: 'District', value: data.district, name: 'district'},
                                {label: 'Street', value: data.street, name: 'street', span: 24},
                                {label: 'Zip Code', value: data.zipcode, name: 'zipcode'},
                                {label: 'Mobile', value: data.mobile, name: 'mobile', type: 'number'},
                                {label: 'Phone', value: data.phone, name: 'phone', type: 'number'},
                                {label: 'Email', value: data.email, name: 'email'}
                            ];
                            break;
                        case 2:
                            this.listData = [
                                {label: '揽收人名称', value: data.name, name: 'name'},
                                {label: '揽收人公司', value: data.company, name: 'company'},
                                {label: '揽收人国家', value: data.country, name: 'country'},
                                {label: '揽收人省/州', value: data.state, name: 'state'},
                                {label: '揽收人城市', value: data.city, name: 'city'},
                                {label: '揽收人地区', value: data.district, name: 'district'},
                                {label: '揽收人街道', value: data.street, name: 'street'},
                                {label: '揽收人邮箱', value: data.email, name: 'email'},
                                {label: '揽收人邮编', value: data.zipcode, name: 'zipcode', type: 'number'},
                                {label: '揽收人电话', value: data.mobile, name: 'mobile', type: 'number'}
                            ];
                            break;
                        case 3:
                            this.listData = [
                                {label: '退货人名称', value: data.name, name: 'name'},
                                {label: '退货人公司', value: data.company, name: 'company'},
                                {label: '退货人国家', value: data.country, name: 'country'},
                                {label: '退货人省/州', value: data.state, name: 'state'},
                                {label: '退货人城市', value: data.city, name: 'city'},
                                {label: '退货人地区', value: data.district, name: 'district'},
                                {label: '退货人街道', value: data.street, name: 'street'},
                                {label: '退货人邮编', value: data.zipcode, name: 'zipcode', type: 'number'},
                                {label: '退货人电话', value: data.mobile, name: 'mobile', type: 'number'},
                                {label: '退货人邮箱', value: data.email, name: 'email'}
                            ];
                            break
                    }
                }
            },
            save(){
                if(!this.addressName){
                    this.$message({type: 'warning', message: '请填写地址名称'});
                    return
                }
                let isComplete = this.listData.every(row => row.value !== '');
                if(!isComplete){
                    this.$message({type: 'warning', message: '请将必填项填写完整'});
                    return
                }
                let reg = /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let str = this.listData.filter(row => row.name === 'email')[0].value;
                if(!reg.test(str)){
                    this.$message({type: 'warning', message: '邮箱格式不正确，请重新填写'});
                    return
                }
                this.$emit('save', this.listData, this.activeName, this.addressName)
            },
            //电话和邮编以及手机号的输入框在中文输入法下输入再直接丢失焦点输入框内会有英文，但是此时输入框的value仍然是空，会造成已经填了但还是会报必填项未填写完整的提示，需要新增一个更友好的提示
            number_test(row){
                if(row.value !== ''){
                    return
                }
                switch(row.name){
                    case 'zipcode':
                        this.$message({type: 'warning', message: '邮编只能为数字'});
                        break;
                    case 'mobile':
                        this.$message({type: 'warning', message: '电话只能为数字'});
                        break;
                    case 'phone':
                        this.$message({type: 'warning', message: '手机号只能为数字'});
                        break;
                    default:
                        return
                }
            },
            handle_click(){
                this.addressName = '';
                switch(Number(this.activeName)){
                    case 1:
                        this.listData = [
                            {label: 'Name', value: '', name: 'name'},
                            {label: 'Company', value: '', name: 'company'},
                            {label: 'Country', value: '', name: 'country'},
                            {label: 'State', value: '', name: 'state'},
                            {label: 'City', value: '', name: 'city'},
                            {label: 'District', value: '', name: 'district'},
                            {label: 'Street', value: '', name: 'street', span: 24},
                            {label: 'Zip Code', value: '', name: 'zipcode', type: 'number'},
                            {label: 'Mobile', value: '', name: 'mobile', type: 'number'},
                            {label: 'Phone', value: '', name: 'phone', type: 'number'},
                            {label: 'Email', value: '', name: 'email'}
                        ];
                        break;
                    case 2:
                        this.listData = [
                            {label: '揽收人名称', value: '', name: 'name'},
                            {label: '揽收人公司', value: '', name: 'company'},
                            {label: '揽收人国家', value: '', name: 'country'},
                            {label: '揽收人省/州', value: '', name: 'state'},
                            {label: '揽收人城市', value: '', name: 'city'},
                            {label: '揽收人地区', value: '', name: 'district'},
                            {label: '揽收人街道', value: '', name: 'street'},
                            {label: '揽收人邮编', value: '', name: 'zipcode', type: 'number'},
                            {label: '揽收人电话', value: '', name: 'mobile', type: 'number'},
                            {label: '揽收人邮箱', value: '', name: 'email'}
                        ];
                        break;
                    case 3:
                        this.listData = [
                            {label: '退货人名称', value: '', name: 'name'},
                            {label: '退货人公司', value: '', name: 'company'},
                            {label: '退货人国家', value: '', name: 'country'},
                            {label: '退货人省/州', value: '', name: 'state'},
                            {label: '退货人城市', value: '', name: 'city'},
                            {label: '退货人地区', value: '', name: 'district'},
                            {label: '退货人街道', value: '', name: 'street'},
                            {label: '退货人邮编', value: '', name: 'zipcode', type: 'number'},
                            {label: '退货人电话', value: '', name: 'mobile', type: 'number'},
                            {label: '退货人邮箱', value: '', name: 'email'}
                        ];
                        break
                }
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                type: Boolean,
                required: true
            },
            action:{
                type: Object,
                required: true
            },
            formData:{
                type: Object,
                required: true
            },
            editable:{
                type: Boolean,
                required: true
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            uiInput:require('@/components/ui-input.vue').default
        },
    }
</script>
