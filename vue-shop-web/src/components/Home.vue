<template>
  <!-- container容器布局组件 -->
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/header.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 折叠和不折叠的宽度 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 是否折叠侧边菜单栏的按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- active-text-color表示激活的文本颜色值 -->
        <!-- ":router='true'可以简写为router " -->
        <!-- unique-opened 只保持一个子菜单的展开 -->
        <!-- collapse 是否水平折叠收起菜单 -->
        <!-- collapse-transition 是否开启折叠动画 -->
        <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active 当前激活菜单的 index https://blog.csdn.net/qq_44722972/article/details/106641314 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index值更改，为了防止一个点开其余跟着一起.解决只接受字符串的方法：加一个空字符串，index为唯一标识，类型string/null -->
          <!-- 使用key后,每一组数据都有唯一的标识，就不会搞错了;使用key必须绑定 v-bind，且里面的数据，必须为数值类型或字符串类型。 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 菜单图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 菜单文本内容 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 把一级菜单的图标和文本放入二级，得到带图标的导航项 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 定义生命周期函数
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击“退出”按钮
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 返回到登录页面
      this.$router.push('/login')
    },

    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(this.menulist)
      // console.log(res)
    },

    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}

// 组件名称就相当于一个类名，可以直接给其加样式
.el-header {
  background-color: #373d41;
  display: flex;
  // 两端对齐
  justify-content: space-between;
  // 使logo左边为空白
  padding-left: 0;
  // 使得按钮居中显示，不上下贴边
  align-items: center;
  // 文本变为白色
  color: #fff;
  // 设置字体大小
  font-size: 20px;
  // 父子选择器
  > div {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
