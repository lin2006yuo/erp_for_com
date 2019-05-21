<template>
    <div class="handle-buttons">
        <el-button v-for="(item, index) in handleButtons"
                   :key="index"
                   class="handle-button ml-sm"
                   type="primary"
                   size="mini"
                   @click.native="item.handle"
                   :disabled="item.disabled || false">
            {{item.title}}
        </el-button>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    export default {
        data() {
           return {};
        },
        props: {
            handleButtons: {},
            type: {
                type: String,
                default() {
                    return 'primary';
                }
            },
            size: {
                type: String,
                default() {
                    return 'mini';
                }
            }
        }
    }
</script>
