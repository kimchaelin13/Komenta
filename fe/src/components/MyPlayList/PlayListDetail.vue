<template>
  <div class="container margin__left__five">
    <!-- 여기 플레이리스트 타이틀, 플레이 리스트 대표사진, 플레이 리스트 작성자, 플레이 리스트 안에 콘텐츠들(각각 장르, 제목, 몇화인지, 러닝타임)-->
    <div class="container__profile">
      <img :src="getUserProfile()" alt="" width="20%" class="cotainer__profileimg"/>
    </div>

    <div class="container__info">
      <h1 class="playlist-display">{{ userProfile.pl_name }}</h1>
    <template v-if="isMyPlyalist(userProfile.u_id)">
      <span class="playlsit-icon playlsit-icon-size " @click="deleteUserPlaylist(playlists[0].pl_id)"
        ><i class="far fa-trash-alt"></i>
      </span>
    </template>
    <template v-else-if="isLikePlaylist()">
        <span class="playlsit-icon playlsit-icon-size" @click="addlikeUserPlaylist()">
            <font-awesome-icon :icon="['far', 'star' ]" />
        </span>
    </template>
    <template v-else>
        <span class="playlsit-icon playlsit-icon-size" @click="cancellikePlaylist()">
            <font-awesome-icon class="playlist__star" :icon="['fas', 'star' ]"/>
        </span>
    </template>
      <h3 class="container__info__comment ">{{ userProfile.pl_comment }}</h3>
      <button class="container__info__button" @click="gotoFeed(userProfile.u_id)">{{userProfile.u_nickname }} 피드 가기</button>
      <v-simple-table fixed-header >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" width="20%">
                Poster
              </th>
              <th class="text-left" width="15%">
                Genre
              </th>
              <th class="text-left" width="25%">
                Title
              </th>
              <th class="text-left" width="45%">
                Review
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(playlist,index) in playlists" :key="index">
              <td @click="goVod(playlist.ve_id)" style="cursor:pointer"><img :src="getPlaylistVodPoster(playlist.v_poster)" class="playlist_vod_img"></td>
              <td>{{ playlist.g_name }}/{{ playlist.gd_name }}</td>
              <td @click="goVod(playlist.ve_id)" style="cursor:pointer" >
                 {{ playlist.v_title }} {{ playlist.ve_episode_num }}회</td>
              <td v-if="showMyRecent()">
                <input
                class="input__length"
                  type="text"
                  v-on:input.prevent="updateInput"
                  :placeholder="playlist.vh_comment"
                  @keydown.enter="addComment(playlist.plc_id)"
                />
              <td v-else>
                <span class="input__length"> {{ playlist.vh_comment }}</span></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { fetchPlayListDetail } from '@/api/vod';
import { mapState } from 'vuex';
import { addReviewPlaylist,unlikePlaylist, likePlaylist,deletePlaylist } from '@/api/user';

export default {
  data() {
    return {
      userProfile:{},
      playlists: [],
      review: '',
    };
  },
  methods: {
      deleteUserPlaylist(plId) {
      this.$swal({
        text: '플레이리스트를 삭제하시겠습니까?',
        icon:'error',
        customClass: {
          container: 'swal2-container'
        },
        showCancelButton: true,
        confirmButtonText: '삭제',
        confirmButtonColor: "#fc3c44",
        cancelButtonText: '취소',
      }).then((result) => {
        if(result.value) {
          this.$swal({
            customClass: {
          container: 'swal2-container'
        },
            text: '플레이리스트를 삭제했습니다.',
            icon: 'success',
            timer: 1300,
            showConfirmButton: false,
          })
          deletePlaylist(plId).then(()=>{
            this.$store.dispatch('FETCH_MYPLAYLIST', this.userInfo.u_id);
            this.$router.push(`/feed/${this.userProfile.u_id}`)
          })
        } else {
          this.$swal({
            customClass: {
          container: 'swal2-container'
        },
            text: '플레이리스트를 삭제를 취소했습니다.',
            icon: 'info',
            timer: 1300,
            showConfirmButton: false,
          })
        }
      })
      
    },
    getPlaylistVodPoster(poster) {
      return `${process.env.VUE_APP_PICTURE}poster/${poster}`;
    },
    isMyPlyalist(uId){
      if (uId == this.userInfo.u_id){
        return true
      }
      return false
    },
    isLikePlaylist() {
      const plId = this.$route.params.id;
      for (let i = 0; i < this.likePlaylist.length; i++) {
        const playlist = this.likePlaylist[i];
        if (playlist[0].pl_id == plId) {
          return false;
        }
      }
      return true;
    },
    async addlikeUserPlaylist() {
      const plId = this.$route.params.id;
      await likePlaylist({ pl_id: plId });
      this.$store.dispatch('FETCH_LIKEPLAYLIST',this.userInfo.u_id)
     this.$swal({
        text: '플레이리스트 좋아요를 했습니다.',
        icon: 'success',
        customClass: {
          container: 'swal2-container'
        },
        timer: 1300,
        showConfirmButton: false,
      })
    },
    async cancellikePlaylist() {
      const plId = this.$route.params.id;
      await unlikePlaylist({ pl_id: plId });
      this.$store.dispatch('FETCH_LIKEPLAYLIST',this.userInfo.u_id)
      this.$swal({
        text: '플레이리스트 좋아요를 취소했습니다.',
        icon: 'error',
        customClass: {
          container: 'swal2-container'
        },
        timer: 1300,
        showConfirmButton: false,
      })
    },
    goVod(veId){
      this.$router.push(`/voddetail/${veId}`)
    },
    updateInput: function(event) {
      const updatedText = event.target.value;
      this.review = updatedText;
    },
    gotoFeed(userId) {
      this.$router.push(`/feed/${userId}`)
    },
    playlistReview(userreview) {
      this.review = userreview;
    },
    async addComment(plId) {
      try {
        const commentInfo = {
          plc_id: plId,
          vh_comment: this.review,
        };
        await addReviewPlaylist(commentInfo);
        this.getStreamingListDetail();
      } catch {
        console.log('플레이리스트 comment생성 실패');
      }
    },
    showMyRecent() {
      if (this.userInfo.u_id == this.playlists[0].u_id) {
        return true;
      }
      return false;
    },
    async getStreamingListDetail() {
      const plId = this.$route.params.id;
      const res = await fetchPlayListDetail(plId);
      this.playlists = res.data;
      this.userProfile = this.playlists[0];
    },
    getUserProfile() {
      if (this.userProfile.u_profile_pic) {
        const split = this.userProfile.u_profile_pic.split('.');
        let profile = split[0];
        return `${process.env.VUE_APP_PICTURE}profile/${profile}`;
      }
      return false
    },
  },
  created() {
    this.getStreamingListDetail();
    this.$store.dispatch('FETCH_LIKEPLAYLIST', this.userInfo.u_id);
    
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      likePlaylist: (state) => state.user.likePlaylist,
    }),
  },
};
</script>

<style scoped>
.margin__left__five{
  margin-left: 5%;
}
.margin__left{
  margin-left: 10%;
}
</style>