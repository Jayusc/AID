import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "@/router/index";
import ApolloClient from 'apollo-boost'
const apolloClient = new ApolloClient({
    // 服务器的地址，注意后台添加graphql这个路由
    uri: 'http://127.0.0.1:3022/graphql'
})
import VueApollo from 'vue-apollo'

Vue.use(VueApollo);
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    router,
    apolloProvider,
    render: h => h(App),
}).$mount('#app')



