<template>
  <b-container class="container-setting">

    <b-form @submit.prevent="submitSignup" style="margin-left:7rem">
      <b-row style="width:40rem">
        <b-col class="col-setting">
          <h2 class="title-text">WELCOME TO KOMENTA</h2>
            <div>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <!-- 메일아이콘 -->
                    <font-awesome-icon :icon="['far', 'envelope' ]" :style="{color:'#495057'}" />
                  </div>
                </div>
                <input
                  v-model="userId"
                  class="form-control form-control-lg"
                  placeholder="example@example.com"
                  type="text"
                  autocapitalize="off"
                />
              </div>
              <!-- 중복 아이디가 아닐 때 표출 -->
              <p class="icon-inline-block" v-show="!isUserIdEmpty && isUserIdValid && !idCheck">
              <!-- 체크표시 아이콘 -->
                <font-awesome-icon class="fw-icon fwCheck" :icon="['fas', 'check' ]" />
              </p>
              <!-- 중복 아이디일 때 표출 -->
              <p class="icon-inline-block" v-show="!isUserIdEmpty && isUserIdValid && idCheck">
              <!-- 엑스표시 아이콘 -->
                <font-awesome-icon class="fw-icon fwTimes" :icon="['fas', 'times' ]" />
              </p>
            </div>
            <p class="warning-form warning-signup">
              <span class="warning-text" v-if="!isUserIdValid">
                id를 이메일형식으로 입력하세요.
              </span>
            </p>

            <div>
              <div class="input-group">
                <input
                  v-model="password"
                  class="form-control form-control-lg"
                  :type="passwordType"
                  placeholder="8자 이상 입력"
                />
                <!-- 눈 모양 클릭하면 아이콘 바뀌면서 비밀번호 표출 -->
                <div class="input-group-append">
                  <div class="input-group-text input-group-button" @click="viewPassword">
                    <font-awesome-icon :icon="['far', fwName ]" :style="{color:'#495057'}" />
                  </div>
                </div>
              </div>
            </div>
            <p class="warning-form warning-signup">
              <span class="warning-text" v-if="!isPasswordValid">
                password를 8자 이상 입력하세요.
              </span>
            </p>

            <div>
              <input
                v-model="passwordConfirm"
                class="form-control form-control-lg"
                type="password"
                placeholder="비밀번호를 다시 한번 입력하세요."
              />
            </div>
            <p class="warning-form warning-signup">
              <span class="warning-text" v-if="!isPasswordConfirmValid">
                password가 일치하지 않습니다.
              </span>
            </p>

            <div>
              <input
                v-model="username"
                class="form-control form-control-lg form-inline-block"
                placeholder="이름을 입력하세요."
                type="text"
              />
              <!-- 중복 닉네임이 아닐 때 표출 -->
              <p class="icon-inline-block" v-show="!isUserNickNameEmpty && !nickCheck">
              <!-- 체크표시 아이콘 -->
                <font-awesome-icon class="fw-icon fwCheck" :icon="['fas', 'check' ]" />
              </p>
              <!-- 중복 닉네임일 때 표출 -->
              <p class="icon-inline-block" v-show="!isUserNickNameEmpty && nickCheck">
              <!-- 엑스표시 아이콘 -->
                <font-awesome-icon class="fw-icon fwTimes" :icon="['fas', 'times' ]" />
              </p>
            </div>
            <phone-certification class="join-authentic" @checkCertification="checkCertification"></phone-certification>

          <div class="fw-checkbox">
              <input type="checkbox" id="term1" value="term1" v-model="isTerm.term1"/>
              <label for="term1"><font-awesome-icon class="chk-label" :icon="[isTerm.icon1, 'check-circle']" /></label>
              <label for="term1">회원약관(필수)</label>
              <span class="termView">약관보기</span>
          </div>
          <div class="fw-checkbox">
            <input type="checkbox" id="term2" value="term2" v-model="isTerm.term2"/>
            <label for="term2"><font-awesome-icon class="chk-label" :icon="[isTerm.icon2, 'check-circle']" /></label>
            <label for="term2">개인정보 수집 및 이용 동의(필수)</label>
            <span class="termView">약관보기</span>
          </div>
          <div class="fw-checkbox">
            <input type="checkbox" id="term3" value="term3" v-model="isTerm.term3"/>
            <label for="term3"><font-awesome-icon class="chk-label" :icon="[isTerm.icon3, 'check-circle']" /></label>
            <label for="term3">마케팅/홍보의 수집 및 이용 동의(선택)</label>
            <span class="termView">약관보기</span>
          </div>
          <div class="fw-checkbox">
            <input type="checkbox" id="allTerm" value="allTerm" v-model="allTerm" @click="allTermcheck"/>
            <label for="allTerm"><font-awesome-icon class="chk-label" :icon="[isTerm.icon4, 'check-circle']" /></label>
            <label for="allTerm">전체 동의</label>
          </div>
        </b-col>
      </b-row>
      <button
        class="btn btn-normal btn-middle"
        :disabled="isSignupDisabled"
        type="submit"
        @click="signupComplete"
        style="margin-left: -12rem; width: 262.31px; height: 40.4px; 
    font-size: 1.075rem; 
    padding: 0.4rem 5.3rem;
    cursor: pointer;"
      >
        가입하기
      </button>
    </b-form>
  </b-container>
</template>

<script>
import PhoneCertification from './user/PhoneCertification.vue';
import { registerUser, dupIdChk, dupNickNameChk } from '@/api/user'; 
import { validateEmail, validatePassword, validatePhoneNum } from '@/utils/validations';
import store from '@/stores/modules/user'

export default {
  components: { PhoneCertification },
  data() {
    return {
      userId: '',
      password: '',
      passwordConfirm: '',
      fwName:"eye",
      username: '',
      userPhoneNumber: '',
      phonebtn:false,
      clickSignupBtn:false,
      passwordType:"password",
      isTerm: {
        term1:false,
        term2:false,
        term3:false,
        icon1:'far',
        icon2:'far',
        icon3:'far',
        icon4:'far'
      },
      allTerm:false,
      termPopup: false,
      showCertiForm: true,
      isAuthentic:false,
      authenResult:'휴대폰 인증',
      idCheck:false,
      nickCheck:false,
    };
  },
  computed: {
    isUserIdEmpty() {
      if(!this.userId) {
        return true;
      }
      return false;
    },
    isUserNickNameEmpty() {
      if(!this.username) {
        return true;
      }
      return false;
    },
    isUsernameValid() {
      if (!this.username) {
        return false;
      }
      return true;
    },
    isUserIdValid() {
      if (!this.userId) {
        return true;
      }
      return validateEmail(this.userId);
    },
    isPasswordValid() {
      if (!this.password) {
        return true;
      }
      return validatePassword(this.password);
    },
    isPasswordConfirmValid() {
      if (!this.passwordConfirm) {
        return true;
      } else if (this.password != this.passwordConfirm) {
        return false;
      }
      return true;
    },
    isSignupDisabled() {
      if (
        !this.isUsernameValid ||
        !this.isUserIdValid ||
        !this.isPasswordValid ||
        !this.isPasswordConfirmValid ||
        !this.isTerm
      ) {
        return true;
      }
      return false;
    },
    putAuthenBtn() {
      return validatePhoneNum(this.userPhoneNumber);
    },
    putPhoneNum() {
      if(this.putAuthenBtn && !this.isAuthentic) {
        return true;
      }
      return false;
    },
    putAuthenNum() {
      if (this.authenNum.length >= 4) {
        return true;
      }
      return false;
    },
  },
  watch: {
    'isTerm.term1': function() {
      if(this.isTerm.term1) {
        this.isTerm.icon1 = 'fas'
      }else {
        this.isTerm.icon1 = 'far'
      }
    },
    'isTerm.term2': function() {
      if(this.isTerm.term2) {
        this.isTerm.icon2 = 'fas'
      }else {
        this.isTerm.icon2 = 'far'
      }
    },
    'isTerm.term3': function() {
      if(this.isTerm.term3) {
        this.isTerm.icon3 = 'fas'
      }else {
        this.isTerm.icon3 = 'far'
      }
    },
    userId : function () {
      this.isDupIdCheck()
    },
    username : function () {
      this.isDupNickNameCheck()
    }
  },
  methods: {
    async isDupIdCheck() {
      try{
        const response = await dupIdChk(this.userId);
        this.idCheck = response.data;
      }catch(err) {
        console.log(err);
      }
      return false;
    },
    async isDupNickNameCheck() {
      try{
        const result = await dupNickNameChk(this.username);
        this.nickCheck = result.data;
      }catch(err) {
        console.log(err);
      }
      return false;
      
    },
    checkCertification() {
      this.userPhoneNumber = store.state.userInfo.u_phone_number;
      this.showCertiForm = false;
    },
    clickphonebtn() {
      this.phonebtn = !this.phonebtn
    },
    viewPassword() {
      // tupe이 password가 tureaus text, false라면 type이 password
      this.passwordType = this.passwordType==="password" ? "text" : "password";
      if(this.passwordType === "text") {
        this.fwName = "eye-slash"
      }else {
        this.fwName = "eye"
      }
    },
    allTermcheck(){
      this.allTerm=!this.allTerm
      if (this.allTerm) {
        this.isTerm.term1=true
        this.isTerm.term2=true
        this.isTerm.term3=true
        this.isTerm.icon1 = 'fas'
        this.isTerm.icon2 = 'fas'
        this.isTerm.icon3 = 'fas'
        this.isTerm.icon4 = 'fas'
      } else {
        this.isTerm.term1=false
        this.isTerm.term2=false
        this.isTerm.term3=false
        this.isTerm.icon1 = 'far'
        this.isTerm.icon2 = 'far'
        this.isTerm.icon3 = 'far'
        this.isTerm.icon4 = 'far'
      }
    },
    // 우리서버이용
    async submitSignup() {
      if(this.idCheck){
        this.$swal({
        text: "이미 사용중인 아이디입니다.",
        icon: 'info',
        timer: 1300,
        showConfirmButton: false,
      })
        return;
      }
      if(this.nickCheck) {
        this.$swal({
        text: "이미 사용중인 닉네임입니다.",
        icon: 'info',
        timer: 1300,
        showConfirmButton: false,
      })
        return;
      }
      if (!this.clickSignupBtn) {
        return;
      }
      try {
        const userData = {
            u_email:this.userId,
            u_pw: this.password,
            u_phone_number : this.userPhoneNumber,
            u_nickname : this.username,
        };
        await registerUser(userData);
        this.$router.push({name:'Login'});
      } catch(error) {
        console.log(error)
      }
    },
    signupComplete() {
      this.clickSignupBtn =true;
    },
    initForm() {
      this.username = '';
      this.password = '';
      this.nickname = '';
    },
 
  },
};
</script>


<style scoped>
  .title-text {
    background: linear-gradient(to right, #feac5e, #c779d0, #4bc0c8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2.3rem;
  }
</style>
