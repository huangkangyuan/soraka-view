<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button v-has="'sys_menu_add'" type="primary" size="small" icon="el-icon-edit" @click="handleCreate()">新建菜单</el-button>
    </div>

    <tree-table v-loading.body="listLoading" :data="list" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="菜单名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="组件">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="重定向">
        <template slot-scope="scope">
          <span>{{ scope.row.redirect }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeClassFilter">{{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="图标">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.ico" :icon-class="scope.row.ico" />
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="资源地址">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="权限">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusClassFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-has="'sys_menu_add'" type="primary" size="small" icon="el-icon-edit" @click="handleCreate(scope.row)">新建</el-button>
          <el-button v-has="'sys_menu_update'" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has="'sys_menu_delete'" type="danger" size="small" @click="deleteData(scope.$index,list,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="postForm.name"/>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="postForm.component"/>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="postForm.redirect"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="postForm.type" size="small">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="2" border>按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="postForm.type === 1" label="图标" prop="ico">
          <el-input v-model="postForm.ico" value="table"/>
        </el-form-item>
        <el-form-item label="资源地址" prop="url">
          <el-input v-model="postForm.url"/>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input v-model="postForm.permission"/>
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
        <el-button v-has="'sys_menu_add'" v-loading="loading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
        <el-button v-has="'sys_menu_update'" v-loading="loading" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from '@/components/TreeTable/customEval'
import { getMenuTree, updateMenu, createMenu, deleteMenu } from '@/api/menu'

export default {
  name: 'MenuList',
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
    },
    typeFilter(type) {
      const typeMap = {
        1: '菜单',
        2: '按钮'
      }
      return typeMap[type]
    },
    typeClassFilter(type) {
      const typeMap = {
        1: '',
        2: 'success'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      loading: false,
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空' }]
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
      getMenuTree().then(response => {
        this.list = response.data
        this.listLoading = false
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
        component: row.component,
        redirect: row.redirect,
        type: row.type,
        ico: row.ico,
        url: row.url,
        permission: row.permission,
        status: row.status
      }
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
          createMenu(params).then(response => {
            this.$notify({
              title: '成功',
              message: '新建菜单成功',
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
          updateMenu(params).then(response => {
            this.$notify({
              title: '成功',
              message: '更新菜单成功',
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
        deleteMenu(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除菜单成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
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
