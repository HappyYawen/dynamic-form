<template>
  <div class="new-form">
    <div class="content">
      <my-form></my-form>
    </div>
  </div>
</template>
<script>
    import MyForm from './form/form.vue';
    export default {
        data(){
            return {
            };
        },
        components:{MyForm}
    }
</script>
<style lang="scss" scoped>
  .new-form{
    background-color: #fff;
    height:100%;
    width:100%;
    .content{
      width:100%;
      padding:15px;
    }
  }
</style>
