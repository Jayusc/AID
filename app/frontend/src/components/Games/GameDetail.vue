<template>
    <div>
        <el-card>
            <div style="font-size: large">
                {{ TeamAbbtoFull1[gameid.team_Home] }} VS {{ TeamAbbtoFull1[gameid.team_Away] }}
            </div>
            <div @click="openComments" v-if="!showComments">..
                <div v-for="(o,i) in gameid.players" :key="i">
                    {{ o.name }}
                </div>
            </div>
        </el-card>


        <div>
            <PlayerRates v-if="showComments" :return-home="returnHome"/>
        </div>
    </div>
</template>

<script>
import PlayerRates from "@/components/player/PlayerRates";
import {TeamAbbtoFull} from "@/components/home/TeamCorresponding";
// import gql from "graphql-tag";

export default {
    name: "GameDetail",
    components: {PlayerRates},
    props: ["returnHome", "gameid"],

    data() {
        return {
            showComments: false,
            TeamAbbtoFull1: TeamAbbtoFull,
            away: [],
        }
    },

    methods: {
        openComments() {
            this.showComments = true
            console.log(this.gameid.players)
            // console.log(this.playerid)
        },
        findReviewIndex(id) {
            console.log(id)
            // this.$apollo.addSmartQuery("Review", {
            //     query: gql`
            //     Query($id: ID!) {
            //     account(id: $id) {
            //     id
            //     username
            //     password
            //     }
            //     }
            //     `,
            // })
            //

        },
    },


    // apollo: {
    //     // 带参数的查询
    //     away: {
    //         // gql 查询
    //         query: gql`query Query($gid: ID!) {
    //             game(gid: $gid){
    //             gid
    //             outcome{
    //             home
    //             away
    //             }
    //             }
    //         }`,
    //         update(data) {
    //             // console.log(this.games)
    //             return data.game;
    //
    //         },
    //         // 静态参数
    //         variables: {
    //             // gid: this.gameid,
    //         },
    //         // fetchPolicy: "no-cors"
    //         // no-core
    //     },

    // },
    created() {
        // console.log(this.gameid)
    }
}</script>


<style scoped>

</style>
