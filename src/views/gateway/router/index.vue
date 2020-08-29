<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">路由id</label>
        <el-input v-model="query.routerId" clearable placeholder="routerId" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">路由名称</label>
        <el-input v-model="query.routerName" clearable placeholder="routerName" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="路由ID" prop="routerId">
            <el-input v-model="form.routerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="路由名称" prop="routerName">
            <el-input v-model="form.routerName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="路由类型" prop="routerType">
            <el-select v-model="form.routerType" placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in routerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="路由url" prop="routerUrl">
            <el-input v-model="form.routerUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="enable">
            <el-radio-group v-model="form.enable" style="width: 178px">
              <el-radio :label="true" border>是</el-radio>
              <el-radio :label="false" border>否</el-radio>
            </el-radio-group>
            <!--            <el-input v-model="form.enable" style="width: 370px;" />-->
          </el-form-item>
          <el-form-item label="阈值" prop="threshold">
            <el-input v-model="form.threshold" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="intervalSec" prop="intervalSec">
            <el-input v-model="form.intervalSec" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">服务接口列表</span>
            </div>
            <el-table
              ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              size="small"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              @current-change="handleCurrentChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="routerId" label="路由ID" />
              <el-table-column prop="routerName" label="路由名" />
              <el-table-column label="路由类型">
                <template slot-scope="scope">
                  {{ scope.row.routerType === 0 ? '内链':'外链' }}
                </template>
              </el-table-column>
              <el-table-column prop="routerUrl" label="路由url" />
              <el-table-column prop="enable" label="是否启用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enable"
                    active-color="#409EFF"
                    inactive-color="#F56C6C"
                    @change="changeEnabled(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="threshold" label="阈值" />
              <el-table-column prop="intervalSec" label="intervalSec" />
              <el-table-column v-permission="['admin','router:edit','router:del']" label="操作" width="150px" align="center">
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
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="选择指定服务接口分配断言" placement="top">
                <span class="role-span">断言分配</span>
              </el-tooltip>
              <el-button
                v-permission="['admin']"
                :disabled="!showPredicateButton"
                :loading="predicateLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="savePredicate"
              >保存</el-button>
            </div>
            <el-table
              ref="predicateTable"
              :data="predicateData"
              tooltip-effect="dark"
              max-height="250"
              style="width: 100%"
              @selection-change="handlePredicateChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="predicateName" label="断言名称" />
              <el-table-column prop="predicateVal" label="断言值" />
            </el-table>
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="选择指定服务接口分配过滤器" placement="top">
                <span class="role-span">过滤器分配</span>
              </el-tooltip>
              <el-button
                v-permission="['admin']"
                :disabled="!showFilterButton"
                :loading="filterLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="saveFilter"
              >保存</el-button>
            </div>
            <el-table
              ref="filterTable"
              :data="filterData"
              :load="getFilterData"
              max-height="250"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleFilterChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="filterName" label="过滤器名称" />
              <el-table-column prop="filterVal" label="过滤器值" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import crudRouter from '@/api/gateway/router'
import { getPredicateList } from '@/api/gateway/predicate'
import { getFilterList } from '@/api/gateway/filter'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  routerId: null,
  routerName: null,
  routerType: null,
  routerUrl: null,
  enable: null,
  threshold: null,
  intervalSec: null
}
export default {
  name: 'ServerRouter',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'Gateway', url: 'router', sort: 'id,desc', crudMethod: { ...crudRouter }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'router:add'],
        edit: ['admin', 'router:edit'],
        del: ['admin', 'router:del']
      },
      routerOptions: [
        {
          value: 0,
          label: '内链'
        },
        {
          value: 1,
          label: '外链'
        }
      ],
      filterData: [], predicateData: [], selectedFilters: [], selectedPredicates: [],
      currentId: null,
      showPredicateButton: false, predicateLoading: false, showFilterButton: false, filterLoading: false,
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        routerId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        routerName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        routerType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        routerUrl: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        threshold: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        intervalSec: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getFilterData()
    this.getPredicateData()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getPredicateData() {
      setTimeout(() => {
        getPredicateList().then(res => {
          // console.log(res.data)
          this.predicateData = res.content
        })
      }, 100)
    },
    getFilterData() {
      setTimeout(() => {
        getFilterList().then(res => {
          this.filterData = res.content
        })
      }, 100)
    },
    savePredicate() {
      this.predicateLoading = true
      const router = { id: this.currentId, predicates: this.selectedPredicates }
      crudRouter.editPredicate(router).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.predicateLoading = false
        this.update()
      }).catch(err => {
        this.predicateLoading = false
        console.log(err.response.data.message)
      })
    },
    saveFilter() {
      this.filterLoading = true
      const router = { id: this.currentId, filters: this.selectedFilters }
      crudRouter.editFilter(router).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.filterLoading = false
        this.update()
      }).catch(err => {
        this.filterLoading = false
        console.log(err.response.data.message)
      })
    },
    handlePredicateChange(val) {
      // console.log(val)
      this.selectedPredicates = val
    },
    handleFilterChange(val) {
      this.selectedFilters = val
    },
    update() {
      // 无刷新更新 表格数据
      crudRouter.get(this.currentId).then(res => {
        // console.log(res)
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            // console.log('响应结果:' + res)
            // console.log(this.crud.data[i])
            this.crud.data[i] = res
            console.log(this.crud.data[i])
            break
          }
        }
      })
    },
    handleCurrentChange(val) {
      if (val) {
        // 清空断言和过滤器的选中
        this.$refs.predicateTable.clearSelection()
        this.$refs.filterTable.clearSelection()
        // 保存当前的路由id
        this.currentId = val.id
        // 初始化默认选中的key
        // console.log('遍历之前')
        // console.log(val.predicates)
        for (let i = 0; i < this.crud.data.length; i++) {
          if (this.currentId === this.crud.data[i].id) {
            val = this.crud.data[i]
          }
        }
        this.selectedPredicates = val.predicates
        this.selectedFilters = val.filters
        this.selectedPredicates.forEach(row => {
          // console.log('选中一项后')
          // console.log(row)
          this.predicateData.forEach(data => {
            if (data.predicateId === row.predicateId) {
              this.$refs.predicateTable.toggleRowSelection(data)
            }
          })
        })
        this.selectedFilters.forEach(row => {
          // console.log(row)
          this.filterData.forEach(data => {
            if (data.filterId === row.filterId) {
              this.$refs.filterTable.toggleRowSelection(data)
            }
          })
        })

        this.showPredicateButton = true
        this.showFilterButton = true
      }
    },
    changeEnabled(data) {
      this.$confirm('此操作将改变路由是否可用，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudRouter.edit(data).then(res => {
          this.crud.notify('更改成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enable = !data.enable
        })
      }).catch(() => {
        data.enable = !data.enable
      })
    }

  }
}
</script>

<style scoped>

</style>
