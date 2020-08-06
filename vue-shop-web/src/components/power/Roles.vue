<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <!-- 为添加按钮绑定一个click函数 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <!-- closable 表示标签可关闭 -->
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <!-- 指向右侧的箭头图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row :span="19"></el-row>
            <!-- <pre>{{ scope.row }}</pre> expand内容对应的代码 -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <!-- 设置一个close事件，使得每次关闭后都刷新权限tree -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <!-- data 要展示的数据 -->
      <!-- props 配置选项 -->
      <!-- show-checkbox 节点可以被选择 -->
      <!-- node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <!-- default-expand-all 默认展开所有节点 -->
      <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户角色对话框** -->
    <el-dialog
      title="修改用户角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="email">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户角色对话框** -->
    <el-dialog
      title="添加用户用户角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],

      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [105, 116],
      // 当前即将分配权限的角色ID
      roleId: [],

      // 控制修改用户角色对话框的显示与隐藏**
      editDialogVisible: false,
      // 查询到的用户角色信息对象**
      editForm: {},
      // 修改用户角色的规则对象**
      editFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },

      // 控制添加用户角色对话框的显示与隐藏**
      addDialogVisible: false,
      // 添加用户角色的表单数据**
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户角色表单的验证规则**
      addFormRules: {
        roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取所有的角色
    this.getRolesList()
  },
  methods: {
    // 获取权限列表,获取list形式，简化promise操作
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // 判断此次列表请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },

    // 根据id删除对应的权限，异步操作简化promise
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户点击取消，会捕获一个字符串cancel
      // 如果用户确认删除，则返回值为字符串confirm
      //console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 删除成功,刷新权限列表，会关闭状态
      // this.getRolesList()
      // 直接返回最新权限数据，防止expand折叠
      role.children = res.data
    },

    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 将 allotRights中的roleId保存下来
      this.roleId = role.id
      // 获取所有权限的数据,异步简化promise操作
      const { data: res } = await this.$http.get('rights/tree')
      // 请求判断
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取数据成功，给所有权限数据赋值
      this.rightslist = res.data
      //console.log(this.rightslist)
      // 递归获取三级子节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        // 返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 返回目前半选中的节点所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //console.log(keys)
      // 将拿到的id拼接成字符串
      const idStr = keys.join(',')
      // 发起请求,异步请求，简化promise
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 刷新权限列表
      this.getRolesList()
      // 隐藏分配权限对话框
      this.setRightDialogVisible = false
    },

    // 展示编辑分类对话框**
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户角色信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      this.getRolesList()
    },
    // 监听编辑用户角色对话框的关闭**
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户角色信息并提交**
    editRoleInfo() {
      // 提交请求前，表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户角色信息失败！')
        }
        // 隐藏修改用户角色对话框
        this.editDialogVisible = false
        this.$message.success('更新用户角色信息成功！')
        this.getRolesList()
      })
    },

    // 根据ID删除对应的用户角色**
    async removeRoleById(id) {
      //console.log(id) 获取ID值成功
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户角色信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户点击取消，会捕获一个字符串cancel
      // 如果用户确认删除，则返回值为字符串confirm
      //console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除用户角色信息成功！')
      // 重新刷新用户列表
      this.getRolesList()
    },

    // 监听添加用户角色对话框的关闭事件**
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新的用户角色**
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) reurn
        // 可以发起添加用户角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户角色失败')
        }
        this.$message.success('添加用户角色成功')
        // 添加成功以后，隐藏用户对话框
        this.addDialogVisible = false
        // 添加成功后，重新刷新用户列表
        this.getRolesList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 为标签之间设置间隙
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
