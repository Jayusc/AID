<template>
    <div>
        <el-col :span="4">
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <img :src="imgUrl" class="image" alt="">
                <div style="padding: 14px;">
                    <span>{{ teamName }}</span>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>

export default {
    name: "TeamCard",
    props: {
        imgUrl: String,
        teamName: String,
    },
    data() {
        return {

        };
    },

    methods: {

    }
}
</script>

<style scoped>
.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>