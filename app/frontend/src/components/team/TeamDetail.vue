<template>
    <div>
<!--        <el-col :span="4">-->
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <img :src="imgurl" class="image" alt="">
                <div style="padding: 14px;">
                </div>
            </el-card>
        <el-card class="marginBottom" shadow="hover">
            <div v-for = "(o,i) in alldata.record.items" key = "i">

            </div>
        </el-card>
<!--        </el-col>-->
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "TeamDetail",
    data(){
        return{
            alldata: null,
            abbrword: "",
            zhende: true,
            imgurl: "",
        }
    },
    props: ["name",
    "abbr"],


    methods: {
        getTeam(abbr){
            axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${abbr}`).then(r => {
                this.alldata = r.data.team
                console.log(this.alldata)
                this.imgurl = this.alldata.logos[0].href
                console.log(this.imgurl)
            })
        }
    },
    created() {
        this.getTeam(this.abbr)
    }
}
</script>

<style scoped>
.marginBottom {
    margin-bottom: 10px;
}
</style>