<template>
    <page>
        <el-card>
            <p slot="header">组件实验室</p>
            <div>
                <span class="title">ui-tip</span>
                <span class="advantage">超出父元素部分以省略号显示</span>
                <!--<span class="drawback">表格每个单元格长度只能均分</span>-->
                <el-table :data="tableData">
                    <el-table-column
                        :label="v.label"
                        inline-template
                        v-for="(v, i) in columnList"
                        :key="i"
                        :width="v.width"
                    >
                        <ui-tip :content="row[v.value]" :width="100"></ui-tip>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <span class="title">request-button</span>
                <div><request-button :request="request">请求按钮</request-button></div>
            </div>
        </el-card>
    </page>
</template>
<script>
    import uiTip from '@/components/ui-tip'
    export default {
        data() {
            return {
                columnList: [
                    {label: '姓名', value: 'name'},
                    {label: '性别', value: 'gender'},
                    {label: '生日', value: 'birthday'},
                    {label: '名族', value: 'ethnic'},
                    {label: '学历', value: 'qualification', width: 500},
                    {label: '党籍', value: 'dangji'},
                    {label: '测试1', value: 't1'},
                    {label: '测试2', value: 't2'},
                    {label: '测试3', value: 't3'},
                    {label: '测试4', value: 't4'},
                ],
                tableData: [
                    {name: 'lin', gender: '男', birthday: '2019-1-1', ethnic: '汉', qualification: '无', dangji: 'o',
                        t1: '123asdasdasddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
                        t2: '213', t3: '41412', t4: '123123'
                    },
                ]
            }
        },
        mounted() {
            console.log(this)
        },
        components: {
            uiTip
        },
        methods: {
            request() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve('请求成功')
                    }, 100)
                }).then(res => {
                    console.log(res)
                    return Promise.resolve()
                })
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .title
        font-size 24px
        font-weight bold
        margin: 10px;
    .advantage
        color: #666
        &:before
            content: '优：'
            color: #00acac
            font-size 14px
    .drawback
        color: #666
        &:before
            content: '缺：'
            color: red
            font-size 14px
</style>
