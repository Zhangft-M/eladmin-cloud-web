<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">predicateName</label>
        <el-input v-model="query.predicateName" clearable placeholder="predicateName" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">predicateVal</label>
        <el-input v-model="query.predicateVal" clearable placeholder="predicateVal" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="predicateName" prop="predicateName">
            <el-input v-model="form.predicateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="predicateVal" prop="predicateVal">
            <el-input v-model="form.predicateVal" style="width: 370px;" />
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
        <el-table-column prop="predicateName" label="predicateName" />
        <el-table-column prop="predicateVal" label="predicateVal" />
        <el-table-column v-permission="['admin','predicate:edit','predicate:del']" label="操作" width="150px" align="center">
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
import crudPredicate from '@/api/gateway/predicate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, predicateName: null, predicateVal: null }
export default {
  name: 'Predicate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ idField: 'predicateId', title: 'predicate', url: 'router/predicates', sort: 'id,desc', crudMethod: { ...crudPredicate }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'predicate:add'],
        edit: ['admin', 'predicate:edit'],
        del: ['admin', 'predicate:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        predicateName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        predicateVal: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'predicateName', display_name: 'predicateName' },
        { key: 'predicateVal', display_name: 'predicateVal' }
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
