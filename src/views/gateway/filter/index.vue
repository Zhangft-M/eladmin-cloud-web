<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">过滤器名称</label>
        <el-input v-model="query.filterName" clearable placeholder="过滤器名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">过滤器的值</label>
        <el-input v-model="query.filterVal" clearable placeholder="过滤器的值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="过滤器名称" prop="filterName">
            <el-input v-model="form.filterName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="过滤器的值">
            <el-input v-model="form.filterVal" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="filterName" label="过滤器名称" />
        <el-table-column prop="filterVal" label="过滤器的值" />
        <el-table-column v-permission="['admin','filter:edit','filter:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudFilter from '@/api/gateway/filter'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, filterName: null, filterVal: null }
export default {
  name: 'Filter',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ idField: 'filterId', title: 'filter', url: 'router/filters', sort: 'id,desc', crudMethod: { ...crudFilter }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'filter:add'],
        edit: ['admin', 'filter:edit'],
        del: ['admin', 'filter:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ],
        filterName: [
          { required: true, message: '过滤器名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'filterName', display_name: '过滤器名称' },
        { key: 'filterVal', display_name: '过滤器的值' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
