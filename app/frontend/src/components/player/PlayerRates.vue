<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
                 label-position="top">
            <el-form-item label-width="132px" label="Overall Rating" prop="field103">
                <el-rate v-model="formData.field103" :max='5' allow-half show-score></el-rate>
            </el-form-item>
            <el-form-item label-width="132px" label="Ability 1" prop="field104">
                <el-rate v-model="formData.field104" :max='5' allow-half show-score></el-rate>
            </el-form-item>
            <el-form-item label-width="132px" label="Ability 2" prop="field105">
                <el-rate v-model="formData.field105" :max='5' allow-half show-score></el-rate>
            </el-form-item>
            <el-form-item label-width="132px" label="Ability 3" prop="field106">
                <el-rate v-model="formData.field106" :max='5' allow-half show-score></el-rate>
            </el-form-item>
            <el-form-item label="Detailed Description" prop="field112">
                <el-input v-model="formData.field112" type="textarea" placeholder="Your Detailed Description..."
                          :autosize="{minRows: 5, maxRows: 5}" :style="{width: '100%'}"></el-input>
            </el-form-item>
            <el-form-item size="large">
                <el-button type="primary" @click="submitForm">Submit</el-button>
                <el-button @click="resetForm">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    components: {},
    props: [],
    data() {
        return {
            formData: {
                field103: 0,
                field104: 0,
                field105: 0,
                field106: 0,
                field112: null,
            },
            rules: {
                field103: [{
                    required: true,
                    message: 'Overall Rating cannot be empty',
                    trigger: 'change'
                }],
                field104: [{
                    required: true,
                    message: 'Overall Rating cannot be empty',
                    trigger: 'change'
                }],
                field105: [{
                    required: true,
                    message: 'Overall Rating cannot be empty',
                    trigger: 'change'
                }],
                field106: [{
                    required: true,
                    message: 'Overall Rating cannot be empty',
                    trigger: 'change'
                }],
                field112: [{
                    required: true,
                    message: 'Please enter full analysis...',
                    trigger: 'blur'
                }],
            },
        }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
        submitForm() {
            this.$refs['elForm'].validate(valid => {
                if (!valid) return
                // TODO 提交表单
            })
        },
        resetForm() {
            this.$refs['elForm'].resetFields()
        },
    }
}

</script>
export default {
name: "PlayersRate"
}
<style>
.el-rate {
    display: inline-block;
    vertical-align: text-top;
}
.el-input__inner{
    height: 100px;
}

</style>
