<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="postForm.username" :disabled="isEdit" auto-complete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="newPassword">
        <el-input v-model="postForm.newPassword" type="password" auto-complete="off" placeholder="请输入密码 不填不更新" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="postForm.name" auto-complete="off" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobilephone">
        <el-input v-model="postForm.mobilephone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="postForm.email" type="email" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="postForm.gender" size="small">
          <el-radio :label="2" border>男</el-radio>
          <el-radio :label="1" border>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-select v-model="postForm.deptId" filterable placeholder="请选择">
          <el-option
            v-for="departement in depts"
            :key="departement.id"
            :label="departement.name"
            :value="departement.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-checkbox-group v-model="postForm.roles">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取消</el-button>
      <el-button v-loading="loading" type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script>
import { validateEmail, validateMobilephone } from '@/utils/validate'
import { get, createUser, updateUser } from '@/api/user'
import { fetchList as getRoles } from '@/api/role'
import { fetchList as getDepts } from '@/api/dept'

const defaultForm = {
  gender: 1,
  roles: [] // 使用空的角色类型
}

export default {
  name: 'UserDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validEmail = (rule, value, callback) => {
      if (value) {
        if (validateEmail(value)) {
          callback()
        } else {
          this.$message({
            message: '邮箱填写不正确',
            type: 'error'
          })
          callback(new Error('邮箱填写不正确'))
        }
      } else {
        callback()
      }
    }
    const validMobilephone = (rule, value, callback) => {
      if (value) {
        if (validateMobilephone(value)) {
          callback()
        } else {
          this.$message({
            message: '手机填写不正确',
            type: 'error'
          })
          callback(new Error('手机填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      roles: [],
      depts: [],
      loading: false,
      rules: {
        username: [{ validator: validateRequire, trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        mobilephone: [{ validator: validMobilephone, trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getUser(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.getUserRole()
    this.getAllDepts()
  },
  methods: {
    getUser(id) {
      get(id).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    getUserRole() {
      getRoles().then(response => {
        this.roles = response.data.rows
      }).catch(err => {
        console.log(err)
      })
    },
    getAllDepts() {
      getDepts().then(response => {
        this.depts = response.data.rows
      }).catch(err => {
        console.log(err)
      })
    },
    cancelSubmit() {
      this.$router.back()
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.postForm)
          if (this.isEdit) {
            updateUser(params).then(response => {
              this.$notify({
                title: '成功',
                message: '更新用户成功',
                type: 'success',
                duration: 2000
              })
              this.$router.back()
            }).catch(err => {
              console.log(err)
            })
          } else {
            createUser(params).then(response => {
              this.$notify({
                title: '成功',
                message: '新建用户成功',
                type: 'success',
                duration: 2000
              })
              this.$router.back()
            }).catch(err => {
              console.log(err)
            })
          }
          this.loading = false
        } else {
          console.log('submit user error!!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  padding: 50px;
}
</style>
