<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleCreate()">新建部门</el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="部门名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="上级部门ID">
        <template slot-scope="scope">
          <span>{{ scope.row.parentId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusClassFilter">{{ scope.row.status | statusFilter }}</el-tag>
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
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="postForm.name"/>
        </el-form-item>
        <el-form-item label="上级部门ID" prop="key">
          <el-input v-model="postForm.parentId"/>
        </el-form-item>
        <el-form-item label="排序" prop="description">
          <el-input v-model="postForm.sequence"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" label="状态" prop="status">
          <el-switch
            v-model="postForm.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="冻结"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-loading="loading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
        <el-button v-loading="loading" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, updateDept, createDept, deleteDept } from '@/api/dept'

export default {
  name: 'DeptList',
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
    }
  },
  data() {
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
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      },
      postForm: {}
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.postForm = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.postForm = Object.assign({}, row) // copy obj
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
          createDept(params).then(response => {
            this.$notify({
              title: '成功',
              message: '新建部门成功',
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
          updateDept(params).then(response => {
            this.$notify({
              title: '成功',
              message: '更新部门成功',
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
        deleteDept(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除部门成功',
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
