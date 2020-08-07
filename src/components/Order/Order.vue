<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
              </el-input>
            </el-col>
        </el-row>
      <el-table :data="orderlist"
                style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50px">
        </el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"
                         width="500px">
        </el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"
                         width="100px">
        </el-table-column>
        <el-table-column prop="pay_status"
                         label="是否付款"
                         width="100px">
                         <template slot-scope="scope">
                            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                            <el-tag type="success" v-else>已付款</el-tag>
                         </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货"
                         width="100px">
        </el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间"
                         width="250px">
          <template slot-scope="scope">
                 {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="136px">
          <template>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="show"></el-button>
          <el-button type="success" size="small" icon="el-icon-location-information" @click="showSee"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum "
      :page-sizes="[10, 15, 20, 25]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
    title="修改地址"
    :visible.sync="dialogVisible"
    width="50%"
    @close = "dialogVisibleClose">
           <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
             <el-form-item label="省市区/县" prop='address1'>
               <!-- <span>省市/区</span> -->
               <el-cascader
                  v-model="editForm.address1"
                  :options="cityData"
                  :props="{ expandTrigger: 'hover' }"
                  @change="handleChange">
              </el-cascader>
              </el-form-item>
               <el-form-item label="详细地址" prop="address2">
                <el-input v-model="editForm.address2"></el-input>
              </el-form-item>
           </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
    <el-dialog title="物流信息"
               :visible.sync="seeDialogVisible"
               width="50%">
          <el-timeline :reverse="wuliulist">
            <el-timeline-item
              v-for="(ac, i) in wuliulist"
              :key="i"
              :timestamp="ac.ftime">
              {{ac.context}}
            </el-timeline-item>
          </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      dialogVisible: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县!', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入地址!', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      seeDialogVisible: false,
      wuliulist: [],
      reverse: true
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      // this.$message.success('获取订单列表成功！')

      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    show () {
      this.dialogVisible = true
    },
    handleChange () {},
    dialogVisibleClose () {
      this.$refs.editFormRef.resetFields()
    },
    async showSee () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }

      this.wuliulist = res.data

      this.seeDialogVisible = true
      console.log(this.wuliulist)
    }
  }

}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
