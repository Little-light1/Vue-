<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 第二步  创建样式 -->
  <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>>

<script>
// 第一步  引入
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {

  },
  // 此时页面上的Dom已经被渲染完毕了
  async mounted () {
    // 3
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    // 4 添加数据
    // var option = {}
    // 5 使用刚指定的配置项和数据显示图表。
    // console.log(res.data)
    const result = _.merge(res.data, this.options)
    //
    // const result = Object.assign(res.data, this.options)
    myChart.setOption(result)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
