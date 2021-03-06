import Vue from 'vue'
import App from './App.vue'
import router from '@/routes/index';
import store from '@/stores/index';
import Vuetify from 'vuetify'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faCheckCircle as farCheckC, faStar as farStar, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle as fasCheckC, faCheck, faTimes, faThumbsUp, faStar, faAngleRight, faAngleLeft, faUserCog, faUpload, faTv} from "@fortawesome/free-solid-svg-icons";
import '@/css/index.css'
import '@/assets/ionic.css'
// google 로그인
import GAuth from 'vue-google-oauth2'

import VueSweetalert2 from "vue-sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Vuetify);


library.add(fasCheckC, faCheck, faTimes, faThumbsUp, faStar, faAngleLeft, faAngleRight, faUserCog, faUpload, faTv) //fas lib
library.add(faEye, faEyeSlash, faEnvelope, farCheckC, farStar, faQuestionCircle) //far lib
Vue.component('font-awesome-icon', FontAwesomeIcon)



Vue.use(GAuth, {
  clientId: '239626612902-chshh1qud8hhvt0k0bc3hcgmq871jgai.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: true
})

new Vue({
  router,
  store,
  vuetify : new Vuetify(),
  render: h => h(App),
}).$mount('#app')
