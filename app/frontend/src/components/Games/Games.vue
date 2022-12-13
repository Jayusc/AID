<template>
    <div>
        <GamesList :players="PostMatchList" :selectFunc="enterCommentsPage" v-if="showPlayersList"/>
        <PlayerRates v-if="showComments"/>
    </div>
</template>

<script>
// import PlayersList from "@/components/player/PlayersList";
import PlayerRates from "@/components/player/PlayerRates";
import GamesList from "@/components/Games/GamesList";
// import axios from "axios";
import axios from "axios";
export default {
    name: "GamesPage",
    components: {PlayerRates, GamesList},
    data() {
        return {
            PostMatchList: [],
            showPlayersList: true,
            selectedPlayerId: null,
            showComments: false
        }
    },

    methods: {
        enterCommentsPage(id) {
            this.selectedPlayerId = id
            this.showComments = true
            this.showPlayersList = false
        },
        getPostmatchinfo(){
            axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")
                .then(r => {
                    // console.log(r.data.events)
                    this.PostMatchList = r.data.events
                })
        }
    },
    created() {
        this.getPostmatchinfo()
    }


}
</script>

<style scoped>

</style>
