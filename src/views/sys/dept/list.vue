<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button v-has="'sys_dept_add'" type="primary" size="small" icon="el-icon-edit" @click="handleCreate()">新建部门</el-button>
    </div>

    <tree-table v-loading.body="listLoading" :data="list" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
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

      <el-table-column width="180px" align="center" label="部门编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="上级部门ID">
        <template slot-scope="scope">
          <span>{{ scope.row.parentId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="排序">
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

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-has="'sys_dept_add'" type="primary" size="small" icon="el-icon-edit" @click="handleCreate(scope.row)">新建</el-button>
          <el-button v-has="'sys_dept_update'" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has="'sys_dept_delete'" type="danger" size="small" @click="deleteData(scope.$index,list,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="postForm.name"/>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="postForm.code" :disabled="dialogStatus == 'update'"/>
        </el-form-item>
        <el-form-item label="排序" prop="description">
          <el-input v-model="postForm.sequence"/>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="postForm.parentId" filterable placeholder="请选择">
            <el-option
              v-for="departement in depts"
              :key="departement.id"
              :label="departement.name"
              :value="departement.id" />
          </el-select>
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
        <el-button v-has="'sys_dept_add'" v-loading="loading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
        <el-button v-has="'sys_dept_update'" v-loading="loading" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from '@/components/TreeTable/customEval'
import { fetchList, updateDept, createDept, deleteDept, getDeptTree } from '@/api/dept'

export default {
  name: 'DeptList',
  components: { treeTable },
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
      func: treeToArray,
      expandAll: false,
      list: [],
      depts: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      loading: false,
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }]
      },
      postForm: {},
      args: [null, null]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDeptTree().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getAllDepts() {
      fetchList().then(response => {
        this.depts = response.data.rows.concat({ id: 0, name: '公司' })
      }).catch(err => {
        console.log(err)
      })
    },
    handleCreate(row) {
      if (row) {
        this.postForm = {
          parentId: row.id,
          sequence: row.children.length + 1
        }
      } else {
        this.postForm = {
          parentId: 0,
          sequence: this.list.length + 1
        }
      }
      this.getAllDepts()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.postForm = {
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        code: row.code,
        status: row.status,
        sequence: row.sequence
      }
      this.getAllDepts()
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
