<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-select
          v-model="query.dbName"
          clearable
          size="small"
          placeholder="数据库名称"
          class="filter-item"
          style="width: 200px"
          @change="getCurrentDbName"
        >
          <el-option v-for="item in dataBaseNames" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input
          v-model="query.name"
          clearable
          size="small"
          placeholder="请输入表名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation>
        <el-tooltip slot="right" class="item" effect="dark" content="数据库中表字段变动时使用该功能" placement="top-start">
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            :loading="syncLoading"
            :disabled="crud.selections.length === 0"
            @click="sync"
          >同步
          </el-button>
        </el-tooltip>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="tableName" label="表名" />
      <el-table-column :show-overflow-tooltip="true" prop="engine" label="数据库引擎" />
      <el-table-column :show-overflow-tooltip="true" prop="coding" label="字符编码集" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-right: 2px" type="text">
            <router-link :to="'/sys-tools/generator/preview/' + scope.row.tableName + '?' + 'dbName=' + dbVal">
              预览
            </router-link>
            <!--            <router-link :to="{path: '/sys-tools/generator/preview/',query:{tableName:scope.row.tableName,dbName:dbVal}}">-->
            <!--              预览-->
            <!--            </router-link>-->
          </el-button>
          <el-button
            size="mini"
            style="margin-left: -1px;margin-right: 2px"
            type="text"
            @click="toDownload(scope.row.tableName)"
          >下载
          </el-button>
          <el-button size="mini" style="margin-left: -1px;margin-right: 2px" type="text">
            <!--            只能在后面加入查询参数，前面是占位符，不能修改-->
            <router-link :to="'/sys-tools/generator/config/' + scope.row.tableName + '?' + 'dbName=' + dbVal">
              配置
            </router-link>
          </el-button>
          <el-button type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">生成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>

import { generator, sync } from '@/api/generator/generator'
import { getDatabase } from '@/api/generator/dataBase'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'GeneratorIndex',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'gen/generator/table/tables', sort: ['create_time,desc'] })
  },
  mixins: [presenter(), header()],
  data() {
    return {
      syncLoading: false,
      dataBaseNames: [],
      dbVal: ''
    }
  },
  created() {
    this.crud.optShow = { add: false, edit: false, del: false, download: false }
    this.getDataBaseNames()
  },
  methods: {
    toGen(tableName) {
      // 生成代码
      generator(this.dbVal, tableName, 0).then(data => {
        this.$notify({
          title: '生成成功',
          type: 'success',
          duration: 2500
        })
      })
    },
    toDownload(tableName) {
      // 打包下载
      generator(this.dbVal, tableName, 2).then(data => {
        downloadFile(data, tableName, 'zip')
      })
    },
    sync() {
      const tables = []
      this.crud.selections.forEach(val => {
        tables.push(val.tableName)
      })
      this.syncLoading = true
      sync(tables).then(() => {
        this.crud.refresh()
        this.crud.notify('同步成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.getDataBaseNames()
        this.syncLoading = false
      }).then(() => {
        this.syncLoading = false
      })
    },
    getDataBaseNames() {
      getDatabase().then(data => {
        this.dataBaseNames = data
      })
    },
    getCurrentDbName(val) {
      console.log(val)
      this.dbVal = val
    }
  }
}
</script>

<style scoped>

</style>
