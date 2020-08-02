<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <!-- 添加角色按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
          </el-col>
      </el-row>
    </el-card>
    <el-card>
      <!-- 角色表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope = "scope">
              <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id" >
            <!-- 一级权限渲染 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)" >{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二三级菜单渲染 -->
            <el-col :span="19">
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id" >
                    <el-col :span="6">
                      <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                        <el-tag closable @close="removeRightById(scope.row,item3.id)" :class="[i3===0?'':'bdtop']" v-for="(item3, i3) in item2.children" :key="item3.id" type="danger">
                            {{item3.authName}}
                        </el-tag>
                    </el-col>

                </el-row>
            </el-col>
              </el-row>
          </template>
        </el-table-column>
        <!-- 主体 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope = "scope">
            <el-button type="primary" icon="el-icon-edit" size="small"
            @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="small"
            @click="roleDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="small" @click="rightsForRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色框 -->
    <el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  width="30%"
  >
  <!-- 添加角色主体 -->
  <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName" >
           <el-input v-model="addRoles.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop ="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
  <!-- 添加角色底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改角色 -->
 <el-dialog title="修改角色信息" :visible.sync="editRoleDialogVisible" width="30%" @close = "editRoleDialogClosed">
    <!-- 修改用户主体 -->
  <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole()">确 定</el-button>
  </span>
</el-dialog>

<!-- 分配权限 -->
  <el-dialog
  title="分配权限"
  :visible.sync="rightsDialogVisible"
  width="50%"
  @close = "setClosed"
 >
  <el-tree :data="rightsList" :props="treeProps"   show-checkbox default-expand-all node-key = "id" :default-checked-keys = "defKeys" ref="treeRef" ></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="rightsdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRights()">确 定</el-button>
  </span>
</el-dialog>
<!-- 删除 -->

  <el-button type="text" @click="roleDelete"></el-button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 添加验证角色对象
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '角色名称的长度在2~6个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色描述的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      editRoleFormRules: {
        email: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '角色名称的长度在2-6个字符之间',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 10,
            message: '角色描述的长度在0~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 编辑角色框的开关
      editRoleDialogVisible: false,

      editRoleForm: {},

      rightsList: [],
      // 分配权限对话框的开关
      rightsDialogVisible: false,
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的权限项
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addRolesRef.resetFields()
    },
    addRole () {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoles)

        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }

        this.$message.success('添加角色成功！')

        this.addDialogVisible = false

        // 重新获取数据
        this.getRolesList()
      })
    },
    async editRoles (id) {
      this.editRoleDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.$message.success('查询角色信息成功！')

      this.editRoleForm = res.data
    },
    editRoleDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑角色
    editRole () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起修改用户信息数据的网络请求
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败！')
        }

        // 隐藏修改用户的对话框
        this.editRoleDialogVisible = false
        // 重新获取用户列表数据
        this.getRolesList()
        // 提示数据修改成功
        this.$message.success('更新角色信息成功！')
      })
    },
    async roleDelete (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      // 更新列表
      this.getRolesList()
    },
    async  removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      // 更新列表
      role.children = res.data
    },
    // 获取权限列表
    async rightsForRole (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }
      this.rightsList = res.data
      // 获取当前已有的权限id
      this.getKeysId(role, this.defKeys)
      this.rightsDialogVisible = true
    },
    // 通过递归获取三级权限id
    getKeysId (node, arr) {
      // 如果node没有children属性则为三级权限，，把这个权限的id放在数组arr中
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item =>
        this.getKeysId(item, arr)
      )
    },
    // 监听分配权限关闭
    setClosed () {
      // 清空权限数组
      this.defKeys = []
    },
    async setRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if (res.meta.status !== 200) {
        return this.$message.error('角色授权失败！')
      }

      this.$message.success('角色授权成功！')
      // 刷新页面
      this.getRolesList()
      this.rightsDialogVisible = false
    }
  }
}

</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
display:flex;
align-items:center,
}
</style>
