<template>
  <div>
<!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<!-- 内容主体区域 -->
<el-card>
  <!-- 添加商品按钮 -->
  <el-button type="primary" @click="showGoodsCategory">添加商品分类</el-button>
  <!-- 商品表格 -->
  <el-table :data="goodsCategoriesList" style="width: 100%" border  row-key="cat_id" lazy
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column   label="#" width="100px" >
    </el-table-column>

     <el-table-column prop="cat_name" label="分类名称" >
    </el-table-column>

     <el-table-column prop="cat_deleted" label="是否有效">
       <template slot-scope="scope">
         <el-switch
            v-model="scope.row.cat_delete"
            active-color="#ff4949"
            inactive-color="#13ce66">
         </el-switch>
       </template>
    </el-table-column>

     <el-table-column prop="cat_level" label="排序" >
    <template slot-scope="scope">
       <el-button type="primary" v-if ='scope.row.cat_level==0' size="small">一级</el-button>
       <el-button type="success" v-else-if="scope.row.cat_level==1" size="small">二级</el-button>
       <el-button type='warning' v-else-if="scope.row.cat_level==2" size="small">三级</el-button>
    </template>
    </el-table-column>
     <el-table-column  label="操作" >
       <template>
         <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
       </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
   <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 6, 8, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
</el-card>
<!-- 添加商品分类对话框 -->
<el-dialog
  title="添加商品分类"
  :visible.sync="addGoodsDialogVisible"
  width="50%"
  @close = "addGoodsDialogVisibleClose"
  >
  <!-- 主体 -->
  <el-form :model="addCategory" :rules="addCategoryRules" ref="addCategoryRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategory.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
         <el-cascader
           v-model="selectedKeys"
           :options="parentsCategoryList"
           :props="cascaderProps"
           @change="parentsChange"  clearable >
        </el-cascader>
        </el-form-item>

      </el-form>
  <!-- 底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addGoodsCategory()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      goodsCategoriesList: [],
      total: 0,
      addGoodsDialogVisible: false,
      addCategory: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCategoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 父级商品数据
      parentsCategoryList: [],
      // 指定级联选择器
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }

    }
  },
  created () {
    this.getGoodsCategoriesList()
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCategoriesList () {
      const { data: res } = await this.$http.get('Categories', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      // this.$message.success('获取商品分类列表成功！')
      this.goodsCategoriesList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCategoriesList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCategoriesList()
    },
    showGoodsCategory () {
      this.getParentsCategory()
      this.addGoodsDialogVisible = true
    },
    async  getParentsCategory () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败！')
      }
      this.parentsCategoryList = res.data
    },
    // 添加商品分类
    addGoodsCategory () {
      // console.log(this.addCategory)
      // 预验证
      this.$refs.addCategoryRef.validate(async valid => {
        if (!valid) return
        // 可以发起网络请求
        const { data: res } = await this.$http.post('categories', this.addCategory)

        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        // 更新页面
        this.getGoodsCategoriesList()
        this.addGoodsDialogVisible = false
      })
    },
    parentsChange () {
      // 大于0说明选择的是父级分类
      if (this.selectedKeys.length > 0) {
        this.addCategory.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]

        this.addCategory.cat_level = this.selectedKeys.length
      } else {
        this.addCategory.cat_pid = 0
        this.addCategory.cat_level = 0
      }
    },
    // 关闭对话框  重置表单数据
    addGoodsDialogVisibleClose () {
      this.$refs.addCategoryRef.resetFields()
      this.selectedKeys.cat_pid = 0
      this.selectedKeys.cat_level = 0
      this.selectedKeys = []
    }
  }
}
</script>

<style lang="less" scoped>

</style>
