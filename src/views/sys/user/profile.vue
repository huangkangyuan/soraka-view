<template>
  <div class="app-container">
    <el-form
      v-loading="loading"
      :model="user"
      label-width="120px"
      element-loading-text="Loading">
      <el-form-item label="姓名">
        <el-input v-model="user.name"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get } from '@/api/user'

export default {
  data() {
    return {
      loading: false,
      user: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      get('1').then(response => {
        this.user = response.data
        this.loading = false
      })
    }
  }
}
</script>
