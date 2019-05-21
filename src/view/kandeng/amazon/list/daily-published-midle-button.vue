<template>
    <div class="mt-sm mb-sm">
        <div class="inline">
            <permission
                tag="ElButton"
                type="primary"
                size="mini"
                :route="api_publish_amazon_batch_delete_task"
                @click="batch_cancelled">
                {{$t('ymx-list.batchCancelled')}}
            </permission>
            <permission
                tag="ElButton"
                type="primary"
                size="mini"
                @click="export_data"
                :route="api_amazon_export">
                {{$t('ymx-list.derive')}}
            </permission>
            <permission
                tag="ElButton"
                type="primary"
                size="mini"
                @click="batch_switch"
                :route="api_amazon_task"
            >{{$t('ymx-list.batchSwitch')}}</permission>
        </div>
    </div>
</template>

<style lang="stylus">

</style>


<script>
    import {url_amazon_task,url_publish_amazon_batch_delete_task,url_amazon_export} from '@/api/amazon-publish-list'
    export default {
        data(){
            return {
                api_amazon_task:url_amazon_task,
                api_publish_amazon_batch_delete_task:url_publish_amazon_batch_delete_task,
                api_amazon_export:url_amazon_export,
            }
        },
        methods:{
            export_data(){
                this.$emit('export-data');
            },
            batch_cancelled(){
                this.$emit('batch-delete');
            },
            batch_switch(){
                this.$emit('batch-switch')
            }
        },
        props:{
            tableData:{

            }
        }
    }
</script>
