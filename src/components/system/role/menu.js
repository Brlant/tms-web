// 菜单权限配置
export default [
  // 基础信息配置
  {
    'id': 'tms-base-info',
    'parentId': null,
    'label': '基础信息',
    'sort': 1,
    'children': [
      {
        'id': 'tms-business-unit',
        'parentId': 'tms-base-info',
        'label': '业务单位',
        'sort': 1,
        'children': [
          {
            'id': 'base-info-manager-audit',
            'parentId': 'tms-business-unit',
            'label': '审核单位',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-business-unit-add',
            'parentId': 'tms-business-unit',
            'label': '新增单位',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-business-unit-query',
            'parentId': 'tms-business-unit',
            'label': '查看业务单位',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-business-unit-edit',
            'parentId': 'tms-business-unit',
            'label': '编辑单位',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-car-archives',
        'parentId': 'tms-base-info',
        'label': '车辆档案',
        'sort': 2,
        'children': [
          {
            'id': 'tms-car-archives-watch',
            'parentId': 'tms-car-archives',
            'label': '查看车辆档案',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-car-archives-edit',
            'parentId': 'tms-car-archives',
            'label': '编辑车辆档案',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'car-blacklist-delete',
            'parentId': 'tms-car-archives',
            'label': '删除运输黑名单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-car-archives-delete',
            'parentId': 'tms-car-archives',
            'label': '删除车辆档案',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'car-blacklist-add',
            'parentId': 'tms-car-archives',
            'label': '新增运输黑名单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-car-archives-add',
            'parentId': 'tms-car-archives',
            'label': '新增车辆档案',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-equipment-consumables',
        'parentId': 'tms-base-info',
        'label': '包装耗材',
        'sort': 3,
        'children': [
          {
            'id': 'tms-equipment-consumables-detail-edit',
            'parentId': 'tms-equipment-consumables',
            'label': '编辑包装耗材详情',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-equipment-consumables-update',
            'parentId': 'tms-equipment-consumables',
            'label': '编辑包装耗材',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-equipment-consumables-delete',
            'parentId': 'tms-equipment-consumables',
            'label': '刪除包装耗材',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-equipment-consumables-add',
            'parentId': 'tms-equipment-consumables',
            'label': '新增包装耗材',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-equipment-consumables-detail-add',
            'parentId': 'tms-equipment-consumables',
            'label': '新增包装耗材详情',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-goods-area',
        'parentId': 'tms-base-info',
        'label': '集货区信息',
        'sort': 4,
        'children': [
          {
            'id': 'tms-goods-area-detail-delete',
            'parentId': 'tms-goods-area',
            'label': '删除集货区单位',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-goods-area-add',
            'parentId': 'tms-goods-area',
            'label': '新增集货区',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-goods-area-edit',
            'parentId': 'tms-goods-area',
            'label': '编辑集货区',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-goods-area-query',
            'parentId': 'tms-goods-area',
            'label': '查看集货区信息',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-goods-area-detail-add',
            'parentId': 'tms-goods-area',
            'label': '新增集货区单位',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-goods-area-delete',
            'parentId': 'tms-goods-area',
            'label': '删除集货区',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      // 仓位档案
      {
        'id': 'tms-storage-bin',
        'parentId': 'tms-base-info',
        'label': '仓位档案',
        'sort': 6,
        'children': [
          {
            'id': 'tms-storage-bin-add',
            'parentId': 'tms-storage-bin',
            'label': '新增',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-storage-bin-edit',
            'parentId': 'tms-storage-bin',
            'label': '编辑',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-storage-bin-query',
            'parentId': 'tms-storage-bin',
            'label': '查询',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-storage-bin-delete',
            'parentId': 'tms-storage-bin',
            'label': '删除',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-storage-bin-export',
            'parentId': 'tms-storage-bin',
            'label': '导出',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      // 第三方承运商
      {
        'id': 'tms-carrier',
        'parentId': 'tms-base-info',
        'label': '第三方承运商管理',
        'sort': 6,
        'children': [
          {
            'id': 'tms-carrier-add',
            'parentId': 'tms-carrier',
            'label': '新增',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-carrier-edit',
            'parentId': 'tms-carrier',
            'label': '编辑',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-carrier-query',
            'parentId': 'tms-carrier',
            'label': '查询',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-carrier-audit',
            'parentId': 'tms-carrier',
            'label': '审核',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
    ],
    'leaf': false
  },
  // 库存管理
  {
    'id': 'tms-stock-manager',
    'parentId': null,
    'label': '库存管理',
    'sort': 1,
    'children': [
      {
        'id': 'tms-transfer-stock',
        'parentId': 'tms-stock-manager',
        'label': '库存管理',
        'sort': 1,
        'children': [
          {
            'id': 'tms-transfer-stock-list',
            'parentId': 'tms-transfer-stock',
            'label': '查询列表',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': false
      },
      {
        'id': 'tms-store-stock',
        'parentId': 'tms-base-info',
        'label': '库位库存',
        'sort': 2,
        'children': [
          {
            'id': 'tms-store-stock-list',
            'parentId': 'tms-store-stock',
            'label': '查询列表',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': false
      },
    ],
    'leaf': false
  },
  // 单据管理
  {
    'id': 'tms-documents-info',
    'parentId': null,
    'label': '单据管理',
    'sort': 2,
    'children': [
      {
        'id': 'tms-order-manager',
        'parentId': 'tms-documents-info',
        'label': '订单管理',
        'sort': 1,
        'children': [
          {
            'id': 'tms-order-dismantling',
            'parentId': 'tms-order-manager',
            'label': '拆解订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-add',
            'parentId': 'tms-order-manager',
            'label': '新增订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-edit',
            'parentId': 'tms-order-manager',
            'label': '编辑订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-delete',
            'parentId': 'tms-order-manager',
            'label': '删除订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-cancel',
            'parentId': 'tms-order-manager',
            'label': '取消订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-generate',
            'parentId': 'tms-order-manager',
            'label': '生成运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-generate-single',
            'parentId': 'tms-order-manager',
            'label': '单独生成运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-query',
            'parentId': 'tms-order-manager',
            'label': '查看订单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-order-export',
            'parentId': 'tms-order-manager',
            'label': '导出订单',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-waybill-manager',
        'parentId': 'tms-documents-info',
        'label': '运单管理',
        'sort': 2,
        'children': [
          {
            'id': 'tms-waybill-edit',
            'parentId': 'tms-waybill-manager',
            'label': '编辑运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-quality-inspection',
            'parentId': 'tms-waybill-manager',
            'label': '运单质量检测',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-export',
            'parentId': 'tms-waybill-manager',
            'label': '导出运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-confirm',
            'parentId': 'tms-waybill-manager',
            'label': '确认运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-suspend',
            'parentId': 'tms-waybill-manager',
            'label': '中止运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-pack',
            'parentId': 'tms-waybill-manager',
            'label': '打包运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-shipment',
            'parentId': 'tms-waybill-manager',
            'label': '启运销退运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-shipment-butt',
            'parentId': 'tms-waybill-manager',
            'label': '启运',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-temperature-delete',
            'parentId': 'tms-waybill-manager',
            'label': '删除包装信息',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-query',
            'parentId': 'tms-waybill-manager',
            'label': '查看运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-sign',
            'parentId': 'tms-waybill-manager',
            'label': '结束运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-cancel',
            'parentId': 'tms-waybill-manager',
            'label': '取消运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-add',
            'parentId': 'tms-waybill-manager',
            'label': '新增运单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-list-export',
            'parentId': 'tms-waybill-manager',
            'label': '导出运单列表excel',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-waybill-transfer-in',
            'parentId': 'tms-waybill-manager',
            'label': '中转入库',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': false
      },
      {
        'id': 'tms-transfer-in',
        'parentId': 'tms-documents-info',
        'label': '中转入库',
        'sort': 3,
        'children': [
          {
            'id': 'tms-transfer-in-view',
            'parentId': 'tms-transfer-in',
            'label': '查看',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-in-assign-person',
            'parentId': 'tms-transfer-in',
            'label': '指派上架人',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-in-receipt-goods',
            'parentId': 'tms-transfer-in',
            'label': '收货',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-in-claim-task',
            'parentId': 'tms-transfer-in',
            'label': '认领任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-in-shelves',
            'parentId': 'tms-transfer-in',
            'label': '上架',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': false
      },
      {
        'id': 'tms-transfer-out',
        'parentId': 'tms-documents-info',
        'label': '中转出库',
        'sort': 4,
        'children': [
          {
            'id': 'tms-transfer-out-save',
            'parentId': 'tms-transfer-out',
            'label': '保存',
            'sort': null,
            'children': null,
            'leaf': true
          }, {
            'id': 'tms-transfer-out-view',
            'parentId': 'tms-transfer-out',
            'label': '查看',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-out-assign-operator',
            'parentId': 'tms-transfer-out',
            'label': '指派操作人',
            'sort': null,
            'children': null,
            'leaf': true
          }, {
            'id': 'tms-transfer-out-claim-task',
            'parentId': 'tms-transfer-out',
            'label': '认领任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-out-unshelve',
            'parentId': 'tms-transfer-out',
            'label': '下架',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-out-outbound',
            'parentId': 'tms-transfer-out',
            'label': '出库',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-transfer-out-cancel',
            'parentId': 'tms-transfer-out',
            'label': '取消',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': false
      },
    ],
    'leaf': false
  },
  // 任务作业
  {
    'id': 'tms-task-manager',
    'parentId': null,
    'label': '任务作业',
    'sort': 3,
    'children': [
      {
        'id': 'tms-task-map-manager',
        'parentId': 'tms-task-manager',
        'label': '地图派送',
        'sort': 1,
        'children': [
          {
            'id': 'tms-task-add',
            'parentId': 'tms-task-map-manager',
            'label': '生成派送',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-carmap-scan',
        'parentId': 'tms-task-manager',
        'label': '车辆分布',
        'sort': 3,
        'children': null,
        'leaf': true
      },
      {
        'id': 'tms-car-state',
        'parentId': 'tms-task-manager',
        'label': '车辆状态',
        'sort': 3,
        'children': [
          {
            'id': 'tms-task-car-task-confirm',
            'parentId': 'tms-task-car-task',
            'label': '保存运输详情',
            'sort': null,
            'children': null,
            'leaf': true
          },
        ],
        'leaf': true
      },
      {
        'id': 'tms-task-car-task',
        'parentId': 'tms-task-manager',
        'label': '出车任务',
        'sort': 2,
        'children': [
          {
            'id': 'tms-task-car-task-confirm',
            'parentId': 'tms-task-car-task',
            'label': '确认出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-edit',
            'parentId': 'tms-task-car-task',
            'label': '编辑出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-prepare-print',
            'parentId': 'tms-task-car-task',
            'label': '打印预排单',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-query',
            'parentId': 'tms-task-car-task',
            'label': '查看出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-start',
            'parentId': 'tms-task-car-task',
            'label': '开始出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-end',
            'parentId': 'tms-task-car-task',
            'label': '结束出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-detail-sort',
            'parentId': 'tms-task-car-task',
            'label': '调整出车任务明细顺序',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-cancel',
            'parentId': 'tms-task-car-task',
            'label': '取消出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-export',
            'parentId': 'tms-task-car-task',
            'label': '导出出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-car-task-print',
            'parentId': 'tms-task-car-task',
            'label': '打印出车任务',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-task-prepare-export',
            'parentId': 'tms-task-car-task',
            'label': '导出预排单',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      }, {
        id: 'tms-task-car-task-export-detail',
        label: '导出运单统计明细'
      }
    ],
    'leaf': false
  },
  // 系统设置
  {
    'id': 'system-config',
    'parentId': null,
    'label': '系统设置',
    'sort': 4,
    'children': [
      {
        'id': 'access-role-manager',
        'parentId': 'tms-system-config',
        'label': '角色管理',
        'sort': 2,
        'children': [
          {
            'id': 'tms-access-role-start',
            'parentId': 'tms-user-role-manager',
            'label': '启用角色',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'access-role-edit',
            'parentId': 'tms-user-role-manager',
            'label': '编辑角色',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-access-role-stop',
            'parentId': 'tms-user-role-manager',
            'label': '停用角色',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'access-role-watch',
            'parentId': 'tms-user-role-manager',
            'label': '查看角色',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'access-role-add',
            'parentId': 'tms-user-role-manager',
            'label': '新增角色',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            id: 'tms-access-platfrom-permission-export',
            label: '导出角色权限信息'
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-system-log',
        'parentId': 'tms-system-config',
        'label': '系统日志',
        'sort': 3,
        'children': null,
        'leaf': true
      },
      {
        'id': 'tms-platform-user-manager',
        'parentId': 'tms-system-config',
        'label': '平台用户管理',
        'sort': 1,
        'children': [
          {
            'id': 'tms-platform-user-add',
            'parentId': 'tms-platform-user-manager',
            'label': '新增平台用户',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-platform-user-edit',
            'parentId': 'tms-platform-user-manager',
            'label': '编辑平台用户',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'tms-platform-user-watch',
            'parentId': 'tms-platform-user-manager',
            'label': '查看平台用户',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'department-delete',
            'parentId': 'tms-platform-user-manager',
            'label': '删除部门',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'department-edit',
            'parentId': 'tms-platform-user-manager',
            'label': '编辑部门',
            'sort': null,
            'children': null,
            'leaf': true
          },
          {
            'id': 'department-add',
            'parentId': 'tms-platform-user-manager',
            'label': '新增部门',
            'sort': null,
            'children': null,
            'leaf': true
          }
        ],
        'leaf': false
      },
      {
        'id': 'tms-attachment-name-update',
        'parentId': 'tms-system-config',
        'label': '编辑附件名称',
        'sort': 4,
        'children': null,
        'leaf': true
      }
    ],
    'leaf': false
  }
];
