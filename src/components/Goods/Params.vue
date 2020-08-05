<template>
  <div>
<!-- 面包屑导航 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
</el-breadcrumb>

<!-- 主体区域 -->
<el-card>
  <!-- 注意事项 -->
  <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning"
    effect="light"
    :closable = "false"
    show-icon>
  </el-alert>
  <!-- 级联选择框 -->
    <el-row class="cat_opt" >
        <el-col>
          <span>选择商品分类: </span>
           <el-cascader
           class="cat_cas"
             v-model="selectedkeys"
             :options="cateList"
             :props="cascaderProps"
             @change="cateChange"
             clearable></el-cascader>
        </el-col>
    </el-row>

  <!-- 表格 -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
       <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
       <el-table :data="manyData"
                 style="width: 100%"
                 border
                 stripe>
         <el-table-column type="expand">
           <template slot-scope="scope">
             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
              @close="handleClose(i,scope.row)">
               {{item}}
             </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput            (scope.row)">+ New Tag</el-button>
           </template>
         </el-table-column>
         <el-table-column type="index" label="#">
         </el-table-column>
         <el-table-column prop="attr_name" label="参数名称" >
         </el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
    </el-tab-pane>

    <el-tab-pane label="静态属性" name="only">
       <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
         <el-table :data="onlyData"
                 style="width: 100%"
                 border
                 stripe
                 >
         <el-table-column type="expand">
            <template slot-scope="scope">
             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
              @close="handleClose(i,scope.row)">
               {{item}}
             </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput            (scope.row)">+ New Tag</el-button>
           </template>
         </el-table-column>
         <el-table-column type="index" label="#">
         </el-table-column>
         <el-table-column prop="attr_name" label="属性名称" >
         </el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
    </el-tab-pane>
  </el-tabs>
  <!-- 添加参数和静态属性对话框 -->
  <el-dialog :title='dialogVisibleName'
             :visible.sync="addDialogVisible"
             width="50%"
             @close="addDialogVisibleClosed">
     <el-form :model="addForm" :rules="addFormRules" ref="addFormref" label-width="100px">
          <el-form-item :label="itemName" prop="attr_name">
             <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
     </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="addParams">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改对话框 -->
  <el-dialog :title="editName"
             :visible.sync="editDialogVisible"
             width="50%"
             @close="editDialogVisibleClosed">
 <el-form :model="editForm" :rules="editFormRules" ref="editFormref" label-width="100px">
          <el-form-item label="名称：" prop="attr_name">
             <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
     </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="editParams">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 删除对话框 -->

</el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      selectedkeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
        // checkStrictly: true
      },
      // 激活的页签名称
      activeName: 'many',
      // 动态参数数据
      manyData: [],
      // 静态参数数据
      onlyData: [],

      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入名称!', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入名称!', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateList = res.data
    },
    cateChange () {
      this.getParamsData()
      // console.log(this.selectedkeys)
      // 获取的不是三级菜单就清空当前数组
      // if (this.selectedkeys.length !== 3) {
      //   this.selectedkeys = []
      // }
      // // 选中的是三级菜单就发送http请求
      // const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
      //   params: { sel: this.activeName }
      // })
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取参数列表失败！')
      // }
    },
    handleClick () {
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedkeys.length !== 3) {
        this.selectedkeys = []
      }
      // 选中的是三级菜单就发送http请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        this.manyData = []
        this.onlyData = []
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    addParams () {
      this.$refs.addFormref.validate(async valid => {
        // 不符合预验证  返回
        if (!valid) return
        // 符合发起添加网络请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name, attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 监听关闭对话框并重置
    addDialogVisibleClosed () {
      this.$refs.addFormref.resetFields()
    },
    async showEdit (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }

      this.editForm = res.data
    },
    editDialogVisibleClosed () {
      this.$refs.editFormref.resetFields()
    },
    editParams () {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    // 删除tags
    async handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.setParams(row)
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setParams(row)
    },
    async setParams (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败！')
      }
      this.$message.success('修改成功！')
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedkeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedkeys.length === 3) {
        return this.selectedkeys[2]
      }
      return null
    },
    dialogVisibleName () {
      if (this.activeName === 'many') {
        return '添加参数'
      } else {
        return '添加属性'
      }
    },
    itemName () {
      if (this.activeName === 'many') {
        return '添加参数'
      } else {
        return '添加属性'
      }
    },
    editName () {
      if (this.activeName === 'many') {
        return '修改参数'
      } else {
        return '修改属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 10px 0;
}
.cat_cas{
  width: 30%;
}
.el-tag{
  margin: 5px;
}
 .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag{
    width: 100px;
  }
</style>
