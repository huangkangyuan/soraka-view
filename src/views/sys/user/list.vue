<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleCreate()">新建用户</el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="性别" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderClassFilter">{{ scope.row.gender | genderFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusClassFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="手机">
        <template slot-scope="scope">
          <span>{{ scope.row.mobilephone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.modifyTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteData(scope.$index,list,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="postForm.username" :disabled="dialogStatus=='update'" auto-complete="off" placeholder="请输入用户名" />
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
        <el-form-item label="用户" prop="roleIds">
          <el-checkbox-group v-model="postForm.roles">
            <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-loading="loading" v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-loading="loading" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { get, fetchList, createUser, updateUser, deleteUser } from '@/api/user'
import { validateEmail, validateMobilephone } from '@/utils/validate'
import { fetchList as getRoles } from '@/api/role'
import { fetchList as getDepts } from '@/api/dept'

const defaultForm = {
  gender: 1,
  roles: [] // 使用空的角色类型
}

export default {
  name: 'UserList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '冻结',
        1: '启用'
      }
      return statusMap[status]
    },
    statusClassFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    genderFilter(gender) {
      const genderMap = {
        0: '未知',
        1: '女',
        2: '男'
      }
      return genderMap[gender]
    },
    genderClassFilter(gender) {
      const genderMap = {
        0: 'info',
        1: 'danger',
        2: 'success'
      }
      return genderMap[gender]
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      loading: false,
      textMap: {
        update: '编辑',
        create: '新建'
      },
      postForm: Object.assign({}, defaultForm),
      roles: [],
      depts: [],
      rules: {
        username: [{ validator: validateRequire, trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        mobilephone: [{ validator: validMobilephone, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getUser(id) {
      get(id).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    getAllRoles() {
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.getAllRoles()
      this.getAllDepts()
      this.postForm = Object.assign({}, defaultForm)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.getAllRoles()
      this.getAllDepts()
      this.getUser(row.id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.postForm)
          createUser(params).then(response => {
            this.$notify({
              title: '成功',
              message: '新建用户成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            this.dialogFormVisible = false
            this.getList()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    updateData() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.postForm)
          updateUser(params).then(response => {
            this.$notify({
              title: '成功',
              message: '更新用户成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            this.dialogFormVisible = false
            this.getList()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    deleteData(index, rows, row) {
      this.$confirm('确认删除该记录吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.loading = true
        deleteUser(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除用户成功',
            type: 'success',
            duration: 2000
          })
          rows.splice(index, 1)
          this.loading = false
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
