<template>
    <div class="c-tree" v-resize="{height:41}">
        <div class="goods-part el-table__header-wrapper">
            <div class="classify_logo">
                <i></i>
                <span  class="color-white" @click="emit_category">全部分类</span>
            </div>
            <div @click.stop="hiddenTree" class="butoon-left">
                <i class="arrow-btn"></i>
            </div>
        </div>
        <div class="el-table__body-wrapper">
            <tree  @change="emit_category" :tree="categoriesTempl"></tree>
        </div>
    </div>
</template>
<script>
export default {
  components : {
      tree:require("../view/product/goods_sku_map/tree.vue").default,
  },
  methods: {
      emit_category(val) {
          this.$emit('change-category', val)
      },
      hiddenTree() {
          this.$emit('hidden-left');
      }
  },
    props:{
        categoriesTempl:''
    },
}
</script>
