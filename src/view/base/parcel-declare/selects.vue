<template>
    <div class="declare-selects">
        <el-select
                v-model="select"
                multiple
                filterable
                remote
                placeholder="请输入关键词（ 空格）（;分号）（,逗号）可多搜索"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="change_select">
            <el-option
                    v-for="item in list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-card class="ui-select-tag">
            <el-tag v-for="(tag,index) in tags" :key="`${index}${tag.label}`">
                {{tag.label}}
                <i class="el-icon-circle-close" @click="remove(tag)"></i>
            </el-tag>
        </el-card>
    </div>
</template>

<style lang="stylus">
    .declare-selects {
        .el-select {
            width: 100%;
        }
        .el-select__tags span {
            display: none;
        }
        .ui-select-tag {
            margin-top: 5px;
            min-height: 50px;
            .el-tag {
                margin: 0 5px 5px 0;
                .el-icon-circle-close {
                    cursor: pointer;
                }
                .el-icon-circle-close:hover {
                    color: red;
                }
            }
        }
    }
</style>


<script>
    export default {
        data() {
            return {
                select: this.value || [],
                list: [],
                loading: false,

            }
        },
        computed: {
            tags() {
                return this.select.map(row => {
                    return {value: row, label: row}
                })
            }
        },
        mounted() {

        },
        methods: {
            remoteMethod(query) {
                this.loading = true;
                let req = this.$http(http('GET', config.apiHost + this.request, {keyword: query}));
                req.then(res => {
                    this.list = res.map(row => {
                        return this.fixResult(row)
                    });
                    this.$nextTick(_=>{
                        const values = query.split(/[;, ]/);
                        values.forEach(value =>{
                            let r = new RegExp(`^${value}$`, 'i');
                            this.list.forEach(item =>{
                                if(r.test(item.value) && this.select.indexOf(item.value) <= 0){
                                    this.select.push(item.value);
                                }
                            })
                        });
                    });
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                })
            },
            change_select() {
            },
            remove(tag) {
                let index = this.select.indexOf(tag.value);
                this.select.splice(index, 1);
            }

        },
        watch: {
            select(val) {
                this.$emit("input", val)
            }
        },
        props: {
            request: {
                type: String
            },

            multiple: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            fixResult: {
                type: Function,
                default(row) {
                    return {
                        label: row,
                        value: row
                    };
                }
            },
            value: {}
        },
    }
</script>