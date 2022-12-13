<template>
    <el-card>
        <div v-if="showAllTeams">
            <div v-for="(o,i) in allTeams" :key="i" @click="() => enterTeamDetail(o.team.displayName, o.team.abbreviation)">
                <TeamCard :imgUrl="o.team.logos[0].href" :teamName="o.team.displayName"/>
            </div>
        </div>
        <TeamDetail v-if="!showAllTeams" :name="selectedTeamName" :abbr="Abbrname" />
    </el-card>
</template>

<script>
import axios from "axios";
import TeamCard from "@/components/team/TeamCard";
import TeamDetail from "@/components/team/TeamDetail";

export default {
    name: "TeamsPages",
    components: {TeamCard, TeamDetail},

    data() {
        return {
            allTeams: [],
            showAllTeams: true,
            selectedTeamName: "",
            Abbrname: "",
        }
    },

    methods: {
        getAllTeams() {
            axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams").then(r => {
                this.allTeams = r.data.sports[0].leagues[0].teams
            })
        },

        enterTeamDetail(name, abbr) {
            this.selectedTeamName = name
            this.Abbrname = abbr
            this.showAllTeams = false

        }
    },

    created() {
        this.getAllTeams()
    }
}
</script>

<style scoped>

</style>
