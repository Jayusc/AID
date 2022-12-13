<template>
    <el-card>
        <div v-if="showHome">
            <div class="bc" @click="shuaxin"></div>
            <div class="left">
                <div v-for="(o, i) in gid" :key="i" @click="() => selectFunc(i)">
                    <el-row >
                        <el-col >
                            <el-card class="box-card marginBottom" shadow="hover" width = "40px">
                                <div>
                                    {{ o.time }}

                                </div>
                                <div>
                                    {{
                                        TeamAbbtoFull1[o.team_Home]
                                    }} VS
                                    {{ TeamAbbtoFull1[o.team_Away] }}

                                </div>
                                <div class="HomePage">
                                    {{ o.outcome.home  }} : {{o.outcome.away}}
                                    <!--                                    {{ o.competitions[0].competitors[1].score }} : {{-->
                                    <!--                                        o.competitions[0].competitors[0].score-->
                                    <!--                                    }}-->
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>


            <div class="middle">
                <div v-for="(o, i) in time" :key="i" @click="() => selectFunc(i)">
                    <el-row>
                        <el-col>
                            <el-card class="box-card marginBottom" shadow="hover">
                                <div>
                                    {{ o.time }}
                                </div>
                                <div>
                                    <!--                                    {{ o.competitions[0].competitors[1].team.name }} VS-->
                                    <!--                                    {{ o.competitions[0].competitors[0].team.name }}-->
                                    {{
                                        TeamAbbtoFull1[o.team_Home]
                                    }} VS
                                    {{ TeamAbbtoFull1[o.team_Away] }}
                                </div>
                                <div>
                                    <!--                                    {{ o.competitions[0].competitors[1].score }} : {{-->
                                    <!--                                        o.competitions[0].competitors[0].score }}-->
                                    {{ o.outcome.home  }} : {{o.outcome.away}}
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>


            <div class="right">
                <div v-for="(o, i) in team_Away" :key="i" @click="() => selectFunc(i)">
                    <el-row>
                        <el-col>
                            <el-card class="box-card marginBottom" shadow="hover">
                                <div>
                                    <!--                                    {{ o.name }}-->
                                    {{ o.time }}
                                </div>
                                <div>
                                    {{
                                        TeamAbbtoFull1[o.team_Home]
                                    }} VS
                                    {{ TeamAbbtoFull1[o.team_Away] }}
                                    <!--                                    {{ o.competitions[0].competitors[1].team.name }} VS-->
                                    <!--                                    {{ o.competitions[0].competitors[0].team.name }}-->
                                </div>
                                <div>
                                    <!--                                    {{ o.competitions[0].competitors[1].score }} : {{-->
                                    <!--                                        o.competitions[0].competitors[0].score-->
                                    <!--                                    }}-->
                                    {{ "Coming next" }}
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>


        <div v-if="showGameDeatil">
            <GameDetail :return-home="returnHome"/>
        </div>
    </el-card>
</template>

<script>
import gql from "graphql-tag"
import axios from "axios";
import GameDetail from "@/components/Games/GameDetail";
// import TeamAbbtoFull from "@/components/TeamCorresponding"
import {TeamAbbtoFull} from "./TeamCorresponding";

// const query = `query($date:String) {
//       games(date: $date) {
//         pid
//         time
//         team_Home
//         team_Away
//       }
//     }`;
// const variables = {
//     date: "2022-12-12"
// };

export default {
    name: 'HomePage',
    components: {GameDetail},
    data() {
        return {
            allMatchesInfo: [],
            gameInfo: {},
            showGameDeatil: false,
            showHome: true,
            gid: [],
            TeamAbbtoFull1: TeamAbbtoFull,
            time: [],
            team_Away: [],
        }
    },

    methods: {
        getMatchesInfo() {
            axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard").then(r => {
                this.allMatchesInfo = r.data.events
            })
        },

        selectFunc(id) {
            console.log(id)
            // axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard").then(r => {
            //     this.gameInfo = r.data.xxxxx
            // })
            this.showHome = false
            this.showGameDeatil = true
        },

        returnHome() {
            this.showHome = true
            this.showGameDeatil = false
        },
        shuaxin() {
            console.log(this.time)
        }
    },

    created() {
        this.getMatchesInfo()
    },
    apollo: {
        // 带参数的查询
        gid: {
            // gql 查询
            query: gql`query Query($date: String) {
                games(date: $date){
                time
                team_Home
                team_Away
                gid
                outcome{
                home
                away
                }
                }
            }`,
            update(data) {
                // console.log(this.games)
                return data.games;

            },
            // 静态参数
            variables: {
                date: '2022-12-10',
            },
            // fetchPolicy: "no-cors"
            // no-core
        },
        time: {
            // gql 查询
            query: gql`query Query($date: String) {
                games(date: $date){
                time
                team_Home
                team_Away
                gid
                outcome{
                home
                away
                }
                players{
                pid
                name
                }

                }
            }`,
            update(data) {
                console.log(data.games)
                return data.games;

            },
            // 静态参数
            variables: {
                date: '2022-12-11',
            },
            // fetchPolicy: "no-cors"
            // no-core
        },

        team_Away: {
            // gql 查询
            query: gql`query Query($date: String) {
                games(date: $date){
                time
                team_Home
                team_Away
                gid
                outcome{
                home
                away
                }
                }
            }`,
            update(data) {
                // console.log(this.games)
                return data.games;

            },
            // 静态参数
            variables: {
                date: '2022-12-12',
            },
            // fetchPolicy: "no-cors"
            // no-core
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bc {
    width: 920px;
    height: 613px;
    background: url("../kristaps_luka_getty_ringer_2.0.png");
    margin: 0 auto;
}

.marginBottom {
    margin-bottom: 10px;
}

body {
    margin: 0;
    padding: 0;
}

.main {
    width: 800px;
    margin: 0 auto;
}

.left {
    width: 33.33%;
    background: white;
    float: left;
}

.middle {
    width: 33.33%;
    background: white;
    float: left;
}

.right {
    width: 33.33%;
    background: white;
    float: right;
}
</style>
