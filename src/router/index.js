import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/login'
import NewForm from '@/components/newForm'
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)
// 3. 创建 router 实例，然后传 `routes` 配置
var router;
export default router =  new Router({
  routes: [// 2. 定义路由
    {
      path: '/',
      name: 'login',
      component: Login// 1. 定义（路由）组件。
    }
  ]
})
router.beforeEach((to, from, next)=>{
  if(to.name==="login"){
    next();
  }else{
    if(localStorage.getItem('isLogin')==="0"){
      router.addRoutes([
        {
          path:'/home/newForm',
          name:'newForm',
          component:NewForm
        }
      ]);
      localStorage.setItem("isLogin","1");
      console.log(router.currentRoute);
      next('/home/newForm');
    }else{
      next();
    }
  }
});
