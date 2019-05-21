<template>
    <div class="page-card">
        <label class="card-label"><i class="red mr-sm" v-if="mustFill">*</i>{{label}}</label>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .page-card {
        padding: 0px;
        .card-label {
            box-sizing: border-box;
            width: 100%;
            color: #5e6d82;
            font-size: 1.25rem;
            padding: 0 21px 10px;
            display: inline-block;
            border-bottom: 2px solid #dee5ee;
        }
        .body {
            padding-top: 10px;
            padding-left: 50px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            width:100%;
        }

    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        props: {
            label: {
                required: true,
                type: String
            },
            mustFill:{
                default(){
                    return false
                }
            }
        },
        components: {}
    }
</script>
