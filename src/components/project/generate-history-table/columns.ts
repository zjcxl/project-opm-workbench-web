import { NButton, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { downloadFile, useMessage } from '@dc-basic-component/util'
import type { ProjectGenerateHistoryVo } from '~/entity/project/project-generate-history-vo'

import fileRecordRequest from '~/api/file-record'

export const columns: DataTableColumns<ProjectGenerateHistoryVo> = [
  {
    title: '序号',
    key: 'no',
    width: 80,
    align: 'center',
    render: (row, index) => index + 1,
  },
  {
    title: '方式',
    key: 'type',
    width: 80,
    align: 'center',
    render: (row) => {
      if (row.type === 1)
        return h(NTag, { type: 'success', size: 'small', bordered: false }, { default: () => '数据库表' })
      if (row.type === 2)
        return h(NTag, { type: 'info', size: 'small', bordered: false }, { default: () => '建表sql' })
    },
  },
  {
    title: '文件数',
    key: 'fileCount',
    width: 100,
    align: 'center',
  },
  {
    title: '项目链',
    key: 'no',
    render: (row) => {
      return [row.project.name, row.template.name, row.develop.name].filter(item => item).join(' > ')
    },
  },
  {
    title: '标题',
    key: 'name',
  },
  {
    title: '生成时间',
    key: 'gmtCreate',
    width: 180,
    align: 'center',
  },
  {
    title: '生成人',
    key: 'createUserName',
    width: 165,
    align: 'center',
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row) {
      // 获取文件的属性信息
      const fileId = row.fileId
      return h(NSpace, {
        justify: 'space-around',
      }, {
        default: () => [
          h(NButton, {
            text: true,
            tag: 'a',
            type: 'primary',
            onClick: () => {
              fileRecordRequest.getById(fileId).then((data) => {
                const file = data.data
                useMessage().success('文件包打包完成，即将下载！')
                downloadFile(file.position + file.path, file.name)
              })
            },
          }, {
            default: () => '下载',
          }),
        ],
      })
    },
  },
]
