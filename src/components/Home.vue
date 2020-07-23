<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header class="home-header">
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 左侧 -->
      <el-aside class="home-aside" :width="isCollapse?'64px':'200px'" >
        <div class="toggle-button" @click="toggle">| | |</div>
        <!-- :unique-opened='true'  或者就是unique-opened 保证一次只有一个子菜单打开
        :router = 'true' 开启路由模式
        -->
        <el-menu
          background-color="rgb(40, 43, 52)"
          text-color="#fff"
          active-text-color="rgb(33,160,255)"
          :unique-opened = "true"
          :collapse="isCollapse"
          :collapse-transition = "false"
          :router = "true"
          :default-active = "activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in MenuList" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'./'+subItem.path" v-for = "subItem in item.children" :key="subItem.id"
            @click="setStorage('./'+subItem.path)"
            >
              <!-- 二级菜单的模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要 -->
      <el-main class="home-main">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      //  左侧菜单数据
      MenuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮折叠展开菜单栏
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      // 清除token
      window.sessionStorage.clear()
      // 转到login页面
      this.$router.push('./login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      this.MenuList = res.data
      if (res.meta.status !== 200) { return this.$message.error('获取菜单列表失败！') }
    },
    // 给sessionStorage赋上activepath的值把index的值存进去
    setStorage (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-header {
  background-color: rgb(33, 34, 44);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}

.home-aside {
  background-color: rgb(40, 43, 52);
  .el-menu{
    border-right:none;
  }
  .toggle-button{
    color: #fff;
    text-align: center;
    background-color: grey;
  }
  // line-height: 200px;
}

.home-main {
  background-color: #e9eef3;
  // line-height: 160px;
}

.home-container {
  // margin-bottom: 40px;
  width: 100%;
  height: 100%;
}
</style>
