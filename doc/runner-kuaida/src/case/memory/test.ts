/* eslint-disable  max-len  */
const schema200 = {
  schemaType: '积木低代码schema协议',
  pages: [
    {
      id: 'FORM-F1866AD13MZIV0J81FX0F72MEQWJ2SNNBHMEKA',
      layout: {
        id: 'jimuroot_9e243c84',
        componentName: 'JimuRoot',
        props: {
          fieldId: 'jimuroot_9e243c84'
        },
        children: [
          {
            id: 'number_8be40e82',
            componentName: 'Number',
            props: {
              label: '数字输入框',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_8be40e82',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_cc850f4b',
            componentName: 'Input',
            props: {
              label: '单行文本输入',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_cc850f4b',
              highlight: false,
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_7c460fbf',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_7c460fbf',
              highlight: false,
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_42d9819c',
            componentName: 'Number',
            props: {
              label: '数字输入框2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_42d9819c',
              highlight: false,
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_19199342',
            componentName: 'Money',
            props: {
              label: '金额',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_19199342',
              highlight: false,
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_542e5f88',
            componentName: 'Select',
            props: {
              label: '单选框',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_542e5f88',
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_ec1da538',
            componentName: 'SelectDD',
            props: {
              label: '多选框',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_ec1da538',
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: false
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_7bf9ed15',
            componentName: 'Date',
            props: {
              label: '日期选择',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_7bf9ed15',
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_630c6ded',
            componentName: 'DateRange',
            props: {
              label: '开始时间',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_630c6ded',
              visibility: {
                type: 'formula',
                formula: '(#{number_8be40e82}===1)',
                value: true
              },
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_c4759c2c',
            componentName: 'Image',
            props: {
              label: '图片',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_c4759c2c',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_8de4c217',
            componentName: 'File',
            props: {
              label: '附件',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_8de4c217',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_1cd9a569',
            componentName: 'People',
            props: {
              label: '单选人员',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_1cd9a569',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_5a9e35c2',
            componentName: 'Department',
            props: {
              label: '部门',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_5a9e35c2',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_79f8a5e6',
            componentName: 'ChatGroup',
            props: {
              label: '群组',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_79f8a5e6',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_a7ada9fc',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_a7ada9fc',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_65b251d6',
            componentName: 'Input',
            props: {
              label: '单行文本输入2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_65b251d6',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_0b74bc10',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_0b74bc10',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_e850c3eb',
            componentName: 'Number',
            props: {
              label: '数字输入框3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_e850c3eb',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_3d073542',
            componentName: 'Money',
            props: {
              label: '金额2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_3d073542',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_29213a53',
            componentName: 'Select',
            props: {
              label: '单选框2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '11',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                },
                {
                  label: '22',
                  value: 'select0xkk2fvy9kke',
                  color: '#FFF2F0'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_29213a53',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_0204ec8b',
            componentName: 'SelectDD',
            props: {
              label: '多选框2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '11',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_0204ec8b',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_7abf085b',
            componentName: 'Date',
            props: {
              label: '日期选择2',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_7abf085b',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_b710ee52',
            componentName: 'DateRange',
            props: {
              label: '开始时间2',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_b710ee52',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_c1c8513c',
            componentName: 'Image',
            props: {
              label: '图片2',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_c1c8513c',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_6d28d182',
            componentName: 'File',
            props: {
              label: '附件2',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_6d28d182',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_fec1f551',
            componentName: 'People',
            props: {
              label: '单选人员2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_fec1f551',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_9c0679cd',
            componentName: 'Department',
            props: {
              label: '部门2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_9c0679cd',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_a623a6c1',
            componentName: 'ChatGroup',
            props: {
              label: '群组2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_a623a6c1',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_196b7a0e',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员2',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_196b7a0e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_13064946',
            componentName: 'Input',
            props: {
              label: '单行文本输入3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_13064946',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_2516ff7b',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_2516ff7b',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_3fe59c78',
            componentName: 'Number',
            props: {
              label: '数字输入框4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_3fe59c78',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_290ea9c4',
            componentName: 'Money',
            props: {
              label: '金额3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_290ea9c4',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_8445bee3',
            componentName: 'Select',
            props: {
              label: '单选框3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '11',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_8445bee3',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_092b3474',
            componentName: 'SelectDD',
            props: {
              label: '多选框3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '22',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_092b3474',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_bb8c0df2',
            componentName: 'Date',
            props: {
              label: '日期选择3',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_bb8c0df2',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_9a9b0724',
            componentName: 'DateRange',
            props: {
              label: '开始时间3',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_9a9b0724',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_a1486945',
            componentName: 'Image',
            props: {
              label: '图片3',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_a1486945',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_c32a0e61',
            componentName: 'File',
            props: {
              label: '附件3',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_c32a0e61',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_02ba9b3d',
            componentName: 'People',
            props: {
              label: '单选人员3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_02ba9b3d',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_b0d79d1d',
            componentName: 'Department',
            props: {
              label: '部门3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_b0d79d1d',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_d261f250',
            componentName: 'ChatGroup',
            props: {
              label: '群组3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_d261f250',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_1cbf0fce',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员3',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_1cbf0fce',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_316e606a',
            componentName: 'Input',
            props: {
              label: '单行文本输入4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_316e606a',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_aa54c365',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_aa54c365',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_dcffe353',
            componentName: 'Number',
            props: {
              label: '数字输入框5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_dcffe353',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_68d0a08e',
            componentName: 'Money',
            props: {
              label: '金额4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_68d0a08e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_d0be3b1c',
            componentName: 'Select',
            props: {
              label: '单选框4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_d0be3b1c',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_d8ed06ed',
            componentName: 'SelectDD',
            props: {
              label: '多选框4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_d8ed06ed',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_9278f60e',
            componentName: 'Money',
            props: {
              label: '金额5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_9278f60e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_52b2bb6f',
            componentName: 'Select',
            props: {
              label: '单选框5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_52b2bb6f',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_20f724cf',
            componentName: 'SelectDD',
            props: {
              label: '多选框5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '1',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_20f724cf',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_71135128',
            componentName: 'Input',
            props: {
              label: '单行文本输入5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_71135128',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_da81c8f0',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_da81c8f0',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_8a653720',
            componentName: 'Number',
            props: {
              label: '数字输入框6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_8a653720',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_a83b2af2',
            componentName: 'Money',
            props: {
              label: '金额6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_a83b2af2',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_952a2b6c',
            componentName: 'Date',
            props: {
              label: '日期选择4',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_952a2b6c',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_9e1734cc',
            componentName: 'DateRange',
            props: {
              label: '开始时间4',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_9e1734cc',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_3892aba5',
            componentName: 'Image',
            props: {
              label: '图片4',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_3892aba5',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_dca26d2c',
            componentName: 'File',
            props: {
              label: '附件4',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_dca26d2c',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_efa403a4',
            componentName: 'People',
            props: {
              label: '单选人员4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_efa403a4',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_d084b469',
            componentName: 'Department',
            props: {
              label: '部门4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_d084b469',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_8eb08d9b',
            componentName: 'ChatGroup',
            props: {
              label: '群组4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_8eb08d9b',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_cbf92fc0',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员4',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_cbf92fc0',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_f4b64ebd',
            componentName: 'Date',
            props: {
              label: '日期选择5',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_f4b64ebd',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_53c770ea',
            componentName: 'DateRange',
            props: {
              label: '开始时间5',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_53c770ea',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_39bb320e',
            componentName: 'Image',
            props: {
              label: '图片5',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_39bb320e',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_f354b7d2',
            componentName: 'File',
            props: {
              label: '附件5',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_f354b7d2',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_1a156332',
            componentName: 'People',
            props: {
              label: '单选人员5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_1a156332',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_0bd05eeb',
            componentName: 'Department',
            props: {
              label: '部门5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_0bd05eeb',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_66957a2d',
            componentName: 'ChatGroup',
            props: {
              label: '群组5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_66957a2d',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_19a92337',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员5',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_19a92337',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_eb4c74c3',
            componentName: 'Input',
            props: {
              label: '单行文本输入6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_eb4c74c3',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_f6204a37',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_f6204a37',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_c4cc0daf',
            componentName: 'Number',
            props: {
              label: '数字输入框7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_c4cc0daf',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_3acf00ba',
            componentName: 'Money',
            props: {
              label: '金额7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_3acf00ba',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'captions_c0b4f903',
            componentName: 'Captions',
            props: {
              label: '说明文字',
              content: '请输入说明文字',
              link: '',
              highlight: 'normal',
              fieldId: 'captions_c0b4f903',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: []
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'selectdd_7496087b',
            componentName: 'SelectDD',
            props: {
              label: '多选框6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              selectddShowType: 'dropDown',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '22',
                  value: 'selectdd06yz3pmxl37',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'selectdd_7496087b',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_6fa49e05',
            componentName: 'Date',
            props: {
              label: '日期选择6',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_6fa49e05',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_0cd0b528',
            componentName: 'DateRange',
            props: {
              label: '开始时间6',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_0cd0b528',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_1373a3c9',
            componentName: 'Image',
            props: {
              label: '图片6',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_1373a3c9',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_26525784',
            componentName: 'File',
            props: {
              label: '附件6',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_26525784',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_3f18eaef',
            componentName: 'People',
            props: {
              label: '单选人员6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_3f18eaef',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_0aaa9f75',
            componentName: 'Department',
            props: {
              label: '部门6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_0aaa9f75',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_dfa03b9c',
            componentName: 'ChatGroup',
            props: {
              label: '群组6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_dfa03b9c',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_f22c6c55',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_f22c6c55',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_6eb71481',
            componentName: 'Input',
            props: {
              label: '单行文本输入7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_6eb71481',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_2d162c02',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_2d162c02',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_5d024fb7',
            componentName: 'Number',
            props: {
              label: '数字输入框8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_5d024fb7',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_4731e6db',
            componentName: 'Money',
            props: {
              label: '金额8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_4731e6db',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_1ce9fc1f',
            componentName: 'Date',
            props: {
              label: '日期选择7',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_1ce9fc1f',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_b7c25315',
            componentName: 'DateRange',
            props: {
              label: '开始时间7',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_b7c25315',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_5aeab995',
            componentName: 'Image',
            props: {
              label: '图片7',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_5aeab995',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_c60cc690',
            componentName: 'File',
            props: {
              label: '附件7',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_c60cc690',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_e3afded4',
            componentName: 'People',
            props: {
              label: '单选人员7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_e3afded4',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_b7386be6',
            componentName: 'Department',
            props: {
              label: '部门7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_b7386be6',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_84103e58',
            componentName: 'ChatGroup',
            props: {
              label: '群组7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_84103e58',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_241ded8e',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_241ded8e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_61ae7617',
            componentName: 'Input',
            props: {
              label: '单行文本输入8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_61ae7617',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_a5074208',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_a5074208',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_61de405d',
            componentName: 'Number',
            props: {
              label: '数字输入框9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_61de405d',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_44c21685',
            componentName: 'Money',
            props: {
              label: '金额9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_44c21685',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_6b803ebc',
            componentName: 'Date',
            props: {
              label: '日期选择8',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_6b803ebc',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_5f41b1bb',
            componentName: 'DateRange',
            props: {
              label: '开始时间8',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_5f41b1bb',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_2bea130d',
            componentName: 'Image',
            props: {
              label: '图片8',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_2bea130d',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_66c0cded',
            componentName: 'File',
            props: {
              label: '附件8',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_66c0cded',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_5f6299e6',
            componentName: 'People',
            props: {
              label: '单选人员8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_5f6299e6',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_6f43bf24',
            componentName: 'Department',
            props: {
              label: '部门8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_6f43bf24',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_f41948c1',
            componentName: 'ChatGroup',
            props: {
              label: '群组8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_f41948c1',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_86f183c4',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_86f183c4',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_eb072c12',
            componentName: 'Input',
            props: {
              label: '单行文本输入9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_eb072c12',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_17508186',
            componentName: 'Input',
            props: {
              label: '单行文本输入10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_17508186',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_d7eb3e17',
            componentName: 'Input',
            props: {
              label: '单行文本输入11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_d7eb3e17',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_edae2243',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_edae2243',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_2ab6bc46',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_2ab6bc46',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_137c332e',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_137c332e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_9cc383aa',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_9cc383aa',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_b0e80906',
            componentName: 'Number',
            props: {
              label: '数字输入框10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_b0e80906',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_c654a05f',
            componentName: 'Number',
            props: {
              label: '数字输入框11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_c654a05f',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_ff91a047',
            componentName: 'Number',
            props: {
              label: '数字输入框12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_ff91a047',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_302b70e6',
            componentName: 'Number',
            props: {
              label: '数字输入框13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_302b70e6',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_d4e8b051',
            componentName: 'Money',
            props: {
              label: '金额10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_d4e8b051',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_1bfa8a51',
            componentName: 'Money',
            props: {
              label: '金额11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_1bfa8a51',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_c11b33b7',
            componentName: 'Money',
            props: {
              label: '金额12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_c11b33b7',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_ae7b47d4',
            componentName: 'Money',
            props: {
              label: '金额13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_ae7b47d4',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_b5a85b71',
            componentName: 'Select',
            props: {
              label: '单选框6',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '3',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_b5a85b71',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_950c9079',
            componentName: 'Select',
            props: {
              label: '单选框7',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '3',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_950c9079',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_c236d35b',
            componentName: 'Select',
            props: {
              label: '单选框8',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: 'w',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_c236d35b',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_c3c34fe2',
            componentName: 'Date',
            props: {
              label: '日期选择9',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_c3c34fe2',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_554a9f3f',
            componentName: 'Date',
            props: {
              label: '日期选择10',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_554a9f3f',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_ba88e198',
            componentName: 'Date',
            props: {
              label: '日期选择11',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_ba88e198',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_09de7101',
            componentName: 'Date',
            props: {
              label: '日期选择12',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_09de7101',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_f7cd1f61',
            componentName: 'DateRange',
            props: {
              label: '开始时间9',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_f7cd1f61',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_59aa6b61',
            componentName: 'DateRange',
            props: {
              label: '开始时间10',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_59aa6b61',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_3de8e61d',
            componentName: 'DateRange',
            props: {
              label: '开始时间11',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_3de8e61d',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_230ddf7e',
            componentName: 'DateRange',
            props: {
              label: '开始时间12',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_230ddf7e',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_e697c5f8',
            componentName: 'DateRange',
            props: {
              label: '开始时间13',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_e697c5f8',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_c28d2969',
            componentName: 'DateRange',
            props: {
              label: '开始时间14',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_c28d2969',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_79d2be60',
            componentName: 'Image',
            props: {
              label: '图片9',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_79d2be60',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_9f061077',
            componentName: 'Image',
            props: {
              label: '图片10',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_9f061077',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_ac847c23',
            componentName: 'Image',
            props: {
              label: '图片11',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_ac847c23',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_0a8b153e',
            componentName: 'Image',
            props: {
              label: '图片12',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_0a8b153e',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_b910c8e0',
            componentName: 'Image',
            props: {
              label: '图片13',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_b910c8e0',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_4612f86e',
            componentName: 'Image',
            props: {
              label: '图片14',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_4612f86e',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_15ccda3a',
            componentName: 'Image',
            props: {
              label: '图片15',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_15ccda3a',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_2bc4f888',
            componentName: 'File',
            props: {
              label: '附件9',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_2bc4f888',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_09ead441',
            componentName: 'File',
            props: {
              label: '附件10',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_09ead441',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_b68b2903',
            componentName: 'File',
            props: {
              label: '附件11',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_b68b2903',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_9e07d585',
            componentName: 'File',
            props: {
              label: '附件12',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_9e07d585',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_06f62762',
            componentName: 'File',
            props: {
              label: '附件13',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_06f62762',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_7ca221f6',
            componentName: 'File',
            props: {
              label: '附件14',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_7ca221f6',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_7ba7ac34',
            componentName: 'People',
            props: {
              label: '单选人员9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_7ba7ac34',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_a1cc1c59',
            componentName: 'People',
            props: {
              label: '单选人员10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_a1cc1c59',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_8209f995',
            componentName: 'People',
            props: {
              label: '单选人员11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_8209f995',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_045fb634',
            componentName: 'People',
            props: {
              label: '单选人员12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_045fb634',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_05054b1a',
            componentName: 'People',
            props: {
              label: '单选人员13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_05054b1a',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_35dad2f7',
            componentName: 'People',
            props: {
              label: '单选人员14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_35dad2f7',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_3a30778a',
            componentName: 'Department',
            props: {
              label: '部门9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_3a30778a',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_e8688c58',
            componentName: 'Department',
            props: {
              label: '部门10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_e8688c58',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_594a726f',
            componentName: 'Department',
            props: {
              label: '部门11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_594a726f',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_83449b70',
            componentName: 'Department',
            props: {
              label: '部门12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_83449b70',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_d770f13a',
            componentName: 'ChatGroup',
            props: {
              label: '群组9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_d770f13a',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_febd7bf8',
            componentName: 'ChatGroup',
            props: {
              label: '群组10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_febd7bf8',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_d222c48c',
            componentName: 'ChatGroup',
            props: {
              label: '群组11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_d222c48c',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_72e7e735',
            componentName: 'ChatGroup',
            props: {
              label: '群组12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_72e7e735',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_b481c71c',
            componentName: 'ChatGroup',
            props: {
              label: '群组13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_b481c71c',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_da7e0516',
            componentName: 'ChatGroup',
            props: {
              label: '群组14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_da7e0516',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_403b44d7',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_403b44d7',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_9f62745c',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_9f62745c',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_1ecabf95',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_1ecabf95',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_b9ed978e',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_b9ed978e',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_33a25f76',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_33a25f76',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'multiplepeople_f585aed2',
            componentName: 'MultiplePeople',
            props: {
              label: '多选人员14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入姓名/mis号，最多添加二十人',
              fieldCaption: '',
              fieldId: 'multiplepeople_f585aed2',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_f16db3a1',
            componentName: 'Input',
            props: {
              label: '单行文本输入12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_f16db3a1',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'input_083bd563',
            componentName: 'Input',
            props: {
              label: '单行文本输入13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'input_083bd563',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                },
                {
                  type: 'regexp',
                  enable: false
                },
                {
                  type: 'repeat',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_fabb7037',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_fabb7037',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'textarea_06f98057',
            componentName: 'TextArea',
            props: {
              label: '多行文本输入14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入文本',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: ''
              },
              fieldId: 'textarea_06f98057',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'length',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_c899f013',
            componentName: 'Number',
            props: {
              label: '数字输入框14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_c899f013',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'number_ff571961',
            componentName: 'Number',
            props: {
              label: '数字输入框15',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_ff571961',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_9e98d260',
            componentName: 'Money',
            props: {
              label: '金额14',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_9e98d260',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'money_e908f121',
            componentName: 'Money',
            props: {
              label: '金额15',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入金额',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'money_e908f121',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_c144de3f',
            componentName: 'Date',
            props: {
              label: '日期选择13',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_c144de3f',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_8674ffa9',
            componentName: 'Date',
            props: {
              label: '日期选择14',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_8674ffa9',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_97a49c78',
            componentName: 'DateRange',
            props: {
              label: '开始时间15',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_97a49c78',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'daterange_eaa5a5fc',
            componentName: 'DateRange',
            props: {
              label: '开始时间16',
              layout: 'HORIZONTAL',
              showLabel: true,
              label2: '结束时间',
              dataRangeCalc: {
                show: false,
                dataRangeCalcTxt: '时长'
              },
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              fieldId: 'daterange_eaa5a5fc',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              label1: '开始时间',
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_44ae2c4f',
            componentName: 'Image',
            props: {
              label: '图片16',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_44ae2c4f',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_9511a2ba',
            componentName: 'Image',
            props: {
              label: '图片17',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_9511a2ba',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_7c1bfb29',
            componentName: 'File',
            props: {
              label: '附件15',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_7c1bfb29',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_16d920f0',
            componentName: 'File',
            props: {
              label: '附件16',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_16d920f0',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_557ac0ea',
            componentName: 'Select',
            props: {
              label: '单选框9',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '11',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_557ac0ea',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_b1484230',
            componentName: 'Select',
            props: {
              label: '单选框10',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '11',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_b1484230',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_ed996a34',
            componentName: 'Select',
            props: {
              label: '单选框11',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '212',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_ed996a34',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'select_20fc5396',
            componentName: 'Select',
            props: {
              label: '单选框12',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请选择',
              dataSource: {
                dataSourceType: 'custom',
                url: '',
                method: '',
                id: ''
              },
              options: [
                {
                  label: '21',
                  value: 'select0oumu4msvjk',
                  color: '#E8F1FF'
                }
              ],
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'select_20fc5396',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ],
              color: true
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_6ddf35bb',
            componentName: 'Date',
            props: {
              label: '日期选择15',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_6ddf35bb',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'date_72c8805f',
            componentName: 'Date',
            props: {
              label: '日期选择16',
              layout: 'HORIZONTAL',
              showLabel: true,
              dateType: 'YYYY-MM-DD',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL'
              },
              fieldId: 'date_72c8805f',
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_f12aee0e',
            componentName: 'Image',
            props: {
              label: '图片18',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_f12aee0e',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'image_9dcf6aff',
            componentName: 'Image',
            props: {
              label: '图片19',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'image_9dcf6aff',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'file_dd5001e7',
            componentName: 'File',
            props: {
              label: '附件17',
              layout: 'HORIZONTAL',
              showLabel: true,
              fieldCaption: '',
              fieldId: 'file_dd5001e7',
              visibility: true,
              styleMaxWidth: {
                value: '100%'
              },
              actionUrl: '/api/file/upload',
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'people_069418e2',
            componentName: 'People',
            props: {
              label: '单选人员15',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入人员姓名/mis号',
              fieldCaption: '',
              fieldId: 'people_069418e2',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'department_69265cfc',
            componentName: 'Department',
            props: {
              label: '部门13',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入完整的部门节点名称',
              fieldCaption: '',
              fieldId: 'department_69265cfc',
              defaultValue: {
                mode: 'NULL'
              },
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          },
          {
            id: 'chatgroup_c88c20b8',
            componentName: 'ChatGroup',
            props: {
              label: '群组15',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '请输入你所在的群名称查询',
              quickJoinRobot: false,
              fieldCaption: '',
              fieldId: 'chatgroup_c88c20b8',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_9e243c84'
          }
        ],
        parentInstanceKey: null
      },
      dataSource: {
        online: []
      }
    }
  ],
  action: {
    source:
      '\n  /**\n    * 私有的，可复用的函数\n    * 函数面板帮助文档: \n    * @see \n    */\n  export function helloWorld(obj) {\n    console.info(obj);\n  }',
    type: 'FUNCTION',
    list: [
      {
        id: 'helloWorld',
        title: 'helloWorld'
      }
    ]
  },
  schemaVersion: '2.0.1'
};

const schema500 = {
  schemaType: '积木低代码schema协议',
  pages: [
    {
      id: 'FORM-F1866AD13MZIV0J81FX0F72MEQWJ2SNNBHMEKA',
      layout: {
        id: 'jimuroot_b7c30dcc',
        componentName: 'JimuRoot',
        props: {
          fieldId: 'jimuroot_b7c30dcc'
        },
        children: [
          {
            id: 'number_e1e8e117',
            componentName: 'Number',
            props: {
              label: '数字输入框',
              layout: 'HORIZONTAL',
              showLabel: true,
              placeholder: '输入数字',
              fieldCaption: '',
              defaultValue: {
                mode: 'NULL',
                val: 0
              },
              fieldId: 'number_e1e8e117',
              highlight: false,
              visibility: true,
              styleMaxWidth: {
                value: 450
              },
              fieldProps: [],
              required: true,
              validation: [
                {
                  type: 'required',
                  enable: true
                },
                {
                  type: 'valueRange',
                  enable: false
                }
              ]
            },
            children: [],
            parentInstanceKey: 'jimuroot_c931c0f1'
          },
          {
            id: 'card_8e7790fe',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_8e7790fe'
            },
            children: [
              {
                id: 'input_443cdc28',
                componentName: 'Input',
                props: {
                  label: '单行文本输入48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_443cdc28',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'input_bdcf2958',
                componentName: 'Input',
                props: {
                  label: '单行文本输入49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_bdcf2958',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'textarea_fea9a291',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_fea9a291',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'textarea_7934788e',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_7934788e',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'number_b9bd40d2',
                componentName: 'Number',
                props: {
                  label: '数字输入框48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_b9bd40d2',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'number_e1b98787',
                componentName: 'Number',
                props: {
                  label: '数字输入框49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_e1b98787',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'money_fd15482e',
                componentName: 'Money',
                props: {
                  label: '金额48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_fd15482e',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'money_7f1cd2b5',
                componentName: 'Money',
                props: {
                  label: '金额49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_7f1cd2b5',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'select_ddf32d6a',
                componentName: 'Select',
                props: {
                  label: '单选框48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_ddf32d6a',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'select_fde6799a',
                componentName: 'Select',
                props: {
                  label: '单选框49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '22',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '33',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '44',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '55',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_fde6799a',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'select_18967811',
                componentName: 'Select',
                props: {
                  label: '单选框60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '222',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '333',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '444',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '555',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_18967811',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'select_ee8b1c32',
                componentName: 'Select',
                props: {
                  label: '单选框62',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '222',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '333',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '444',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '555',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_ee8b1c32',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'select_1dc525c2',
                componentName: 'Select',
                props: {
                  label: '单选框63',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '22',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '33',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '44',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '55',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_1dc525c2',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'selectdd_d2c39707',
                componentName: 'SelectDD',
                props: {
                  label: '多选框48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_d2c39707',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'selectdd_3e4b65a7',
                componentName: 'SelectDD',
                props: {
                  label: '多选框49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_3e4b65a7',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'selectdd_526f7c6f',
                componentName: 'SelectDD',
                props: {
                  label: '多选框60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_526f7c6f',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'selectdd_e3973de3',
                componentName: 'SelectDD',
                props: {
                  label: '多选框62',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_e3973de3',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'selectdd_b54d5d4c',
                componentName: 'SelectDD',
                props: {
                  label: '多选框63',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_b54d5d4c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'date_9f1862d1',
                componentName: 'Date',
                props: {
                  label: '日期选择48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_9f1862d1',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'date_a1ba4887',
                componentName: 'Date',
                props: {
                  label: '日期选择49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_a1ba4887',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'daterange_c80d0a46',
                componentName: 'DateRange',
                props: {
                  label: '开始时间48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_c80d0a46',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'daterange_36b508aa',
                componentName: 'DateRange',
                props: {
                  label: '开始时间49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_36b508aa',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'image_ea02752f',
                componentName: 'Image',
                props: {
                  label: '图片36',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_ea02752f',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'image_eb8ad172',
                componentName: 'Image',
                props: {
                  label: '图片37',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_eb8ad172',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'file_61732802',
                componentName: 'File',
                props: {
                  label: '附件48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_61732802',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'file_83122d26',
                componentName: 'File',
                props: {
                  label: '附件49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_83122d26',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'people_b5e2502c',
                componentName: 'People',
                props: {
                  label: '单选人员26',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_b5e2502c',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'people_a7d46a1d',
                componentName: 'People',
                props: {
                  label: '单选人员27',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_a7d46a1d',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'department_37e437c9',
                componentName: 'Department',
                props: {
                  label: '部门26',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_37e437c9',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'department_66e23ca5',
                componentName: 'Department',
                props: {
                  label: '部门27',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_66e23ca5',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'chatgroup_0d5bc6ea',
                componentName: 'ChatGroup',
                props: {
                  label: '群组26',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_0d5bc6ea',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'chatgroup_16eb8567',
                componentName: 'ChatGroup',
                props: {
                  label: '群组27',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_16eb8567',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'associatedrecord_66bec7d0',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录26',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_66bec7d0',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'associatedrecord_01f93fd0',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录27',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_01f93fd0',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'associatedquery_06e7f3ea',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询26',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_06e7f3ea',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              },
              {
                id: 'associatedquery_78636107',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询27',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_78636107',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_8e7790fe'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_f850f1a3',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_f850f1a3'
            },
            children: [
              {
                id: 'columnsgrid_5a25d7d1',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_5a25d7d1'
                },
                children: [
                  {
                    id: 'column_bc36089f',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_bc36089f'
                    },
                    children: [
                      {
                        id: 'input_1e2287d6',
                        componentName: 'Input',
                        props: {
                          label: '单行文本输入62',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入文本',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: ''
                          },
                          fieldId: 'input_1e2287d6',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'length',
                              enable: false
                            },
                            {
                              type: 'regexp',
                              enable: false
                            },
                            {
                              type: 'repeat',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_bc36089f'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_5a25d7d1'
                  },
                  {
                    id: 'column_d734e6a3',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_d734e6a3'
                    },
                    children: [
                      {
                        id: 'input_71c23843',
                        componentName: 'Input',
                        props: {
                          label: '单行文本输入63',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入文本',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: ''
                          },
                          fieldId: 'input_71c23843',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'length',
                              enable: false
                            },
                            {
                              type: 'regexp',
                              enable: false
                            },
                            {
                              type: 'repeat',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_d734e6a3'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_5a25d7d1'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'textarea_6342d9e8',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入62',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_6342d9e8',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'textarea_a9bbbff1',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入63',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_a9bbbff1',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'columnsgrid_15b49150',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_15b49150'
                },
                children: [
                  {
                    id: 'column_bffe5976',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_bffe5976'
                    },
                    children: [
                      {
                        id: 'number_95ae3b37',
                        componentName: 'Number',
                        props: {
                          label: '数字输入框62',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入数字',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'number_95ae3b37',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_bffe5976'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_15b49150'
                  },
                  {
                    id: 'column_33146d2e',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_33146d2e'
                    },
                    children: [
                      {
                        id: 'number_1c6243cf',
                        componentName: 'Number',
                        props: {
                          label: '数字输入框63',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入数字',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'number_1c6243cf',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_33146d2e'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_15b49150'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'columnsgrid_ea1600b5',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_ea1600b5'
                },
                children: [
                  {
                    id: 'column_d07c60fa',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_d07c60fa'
                    },
                    children: [
                      {
                        id: 'money_578065fb',
                        componentName: 'Money',
                        props: {
                          label: '金额62',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入金额',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'money_578065fb',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_d07c60fa'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_ea1600b5'
                  },
                  {
                    id: 'column_4ee9342f',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_4ee9342f'
                    },
                    children: [
                      {
                        id: 'money_aec3f23c',
                        componentName: 'Money',
                        props: {
                          label: '金额63',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入金额',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'money_aec3f23c',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_4ee9342f'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_ea1600b5'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'columnsgrid_869d7626',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_869d7626'
                },
                children: [
                  {
                    id: 'column_aae194a6',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_aae194a6'
                    },
                    children: [
                      {
                        id: 'date_d5e4f9df',
                        componentName: 'Date',
                        props: {
                          label: '日期选择62',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          dateType: 'YYYY-MM-DD',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'date_d5e4f9df',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_aae194a6'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_869d7626'
                  },
                  {
                    id: 'column_50c68a59',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_50c68a59'
                    },
                    children: [
                      {
                        id: 'date_55ebe234',
                        componentName: 'Date',
                        props: {
                          label: '日期选择63',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          dateType: 'YYYY-MM-DD',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'date_55ebe234',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_50c68a59'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_869d7626'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'columnsgrid_628cab33',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_628cab33'
                },
                children: [
                  {
                    id: 'column_978cc78f',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_978cc78f'
                    },
                    children: [
                      {
                        id: 'daterange_b161a753',
                        componentName: 'DateRange',
                        props: {
                          label: '开始时间62',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          label2: '结束时间',
                          dataRangeCalc: {
                            show: false,
                            dataRangeCalcTxt: '时长'
                          },
                          dateType: 'YYYY-MM-DD',
                          fieldCaption: '',
                          fieldId: 'daterange_b161a753',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          label1: '开始时间',
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_978cc78f'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_628cab33'
                  },
                  {
                    id: 'column_78694578',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_78694578'
                    },
                    children: [
                      {
                        id: 'people_5f3df9b5',
                        componentName: 'People',
                        props: {
                          label: '单选人员37',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请输入人员姓名/mis号',
                          fieldCaption: '',
                          fieldId: 'people_5f3df9b5',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_78694578'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_628cab33'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'columnsgrid_28417f18',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_28417f18'
                },
                children: [
                  {
                    id: 'column_91852a64',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_91852a64'
                    },
                    children: [
                      {
                        id: 'daterange_c695b145',
                        componentName: 'DateRange',
                        props: {
                          label: '开始时间63',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          label2: '结束时间',
                          dataRangeCalc: {
                            show: false,
                            dataRangeCalcTxt: '时长'
                          },
                          dateType: 'YYYY-MM-DD',
                          fieldCaption: '',
                          fieldId: 'daterange_c695b145',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          label1: '开始时间',
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_91852a64'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_28417f18'
                  },
                  {
                    id: 'column_6eebd03c',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_6eebd03c'
                    },
                    children: [
                      {
                        id: 'people_68471a09',
                        componentName: 'People',
                        props: {
                          label: '单选人员36',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请输入人员姓名/mis号',
                          fieldCaption: '',
                          fieldId: 'people_68471a09',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_6eebd03c'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_28417f18'
                  }
                ],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'image_400ebe7e',
                componentName: 'Image',
                props: {
                  label: '图片50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_400ebe7e',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'image_1a251f76',
                componentName: 'Image',
                props: {
                  label: '图片51',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_1a251f76',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'file_c544d80b',
                componentName: 'File',
                props: {
                  label: '附件62',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_c544d80b',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'file_7a120f03',
                componentName: 'File',
                props: {
                  label: '附件63',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_7a120f03',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'department_5c21bd15',
                componentName: 'Department',
                props: {
                  label: '部门36',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_5c21bd15',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'department_c5d4422c',
                componentName: 'Department',
                props: {
                  label: '部门37',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_c5d4422c',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'chatgroup_6a6fc7c1',
                componentName: 'ChatGroup',
                props: {
                  label: '群组36',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_6a6fc7c1',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'chatgroup_abbe5796',
                componentName: 'ChatGroup',
                props: {
                  label: '群组37',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_abbe5796',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'associatedrecord_b2a44c9a',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录36',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_b2a44c9a',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'associatedrecord_af569ff9',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录37',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_af569ff9',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'associatedquery_9954bb4d',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询34',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_9954bb4d',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              },
              {
                id: 'associatedquery_5ca1ad9c',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询35',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_5ca1ad9c',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_f850f1a3'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_c7a27fa0',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_c7a27fa0'
            },
            children: [
              {
                id: 'input_4c3af212',
                componentName: 'Input',
                props: {
                  label: '单行文本输入60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_4c3af212',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'input_11b622be',
                componentName: 'Input',
                props: {
                  label: '单行文本输入61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_11b622be',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'textarea_d9fc423b',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_d9fc423b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'textarea_f1040630',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_f1040630',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'number_0f26156b',
                componentName: 'Number',
                props: {
                  label: '数字输入框60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_0f26156b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'number_9181cbab',
                componentName: 'Number',
                props: {
                  label: '数字输入框61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_9181cbab',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'money_dfa8c3ec',
                componentName: 'Money',
                props: {
                  label: '金额60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_dfa8c3ec',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'money_8c047422',
                componentName: 'Money',
                props: {
                  label: '金额61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_8c047422',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'select_1e5eab25',
                componentName: 'Select',
                props: {
                  label: '单选框61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_1e5eab25',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'selectdd_54fd3210',
                componentName: 'SelectDD',
                props: {
                  label: '多选框61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_54fd3210',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'date_b18bcec5',
                componentName: 'Date',
                props: {
                  label: '日期选择60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_b18bcec5',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'date_ba76edf2',
                componentName: 'Date',
                props: {
                  label: '日期选择61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_ba76edf2',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'daterange_84ee7356',
                componentName: 'DateRange',
                props: {
                  label: '开始时间60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_84ee7356',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'daterange_4d8c3aec',
                componentName: 'DateRange',
                props: {
                  label: '开始时间61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_4d8c3aec',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'image_c38e2ced',
                componentName: 'Image',
                props: {
                  label: '图片48',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_c38e2ced',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'image_1d981b7a',
                componentName: 'Image',
                props: {
                  label: '图片49',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_1d981b7a',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'file_c0d388e5',
                componentName: 'File',
                props: {
                  label: '附件60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_c0d388e5',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'file_27155db2',
                componentName: 'File',
                props: {
                  label: '附件61',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_27155db2',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'people_6d6fff76',
                componentName: 'People',
                props: {
                  label: '单选人员34',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_6d6fff76',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'people_70129a9f',
                componentName: 'People',
                props: {
                  label: '单选人员35',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_70129a9f',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'department_a2bdabc6',
                componentName: 'Department',
                props: {
                  label: '部门34',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_a2bdabc6',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'department_673a1a04',
                componentName: 'Department',
                props: {
                  label: '部门35',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_673a1a04',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'chatgroup_8eae49e4',
                componentName: 'ChatGroup',
                props: {
                  label: '群组34',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_8eae49e4',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'chatgroup_d1478a38',
                componentName: 'ChatGroup',
                props: {
                  label: '群组35',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_d1478a38',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'associatedrecord_2d34de40',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录34',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_2d34de40',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'associatedrecord_bbeb3479',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录35',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_bbeb3479',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'associatedquery_52af7368',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询32',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_52af7368',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              },
              {
                id: 'associatedquery_5ff50e2e',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询33',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_5ff50e2e',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_c7a27fa0'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_797cbbef',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_797cbbef'
            },
            children: [
              {
                id: 'columnsgrid_b1175ee1',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_b1175ee1'
                },
                children: [
                  {
                    id: 'column_680c0836',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_680c0836'
                    },
                    children: [
                      {
                        id: 'input_af8607ef',
                        componentName: 'Input',
                        props: {
                          label: '单行文本输入58',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入文本',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: ''
                          },
                          fieldId: 'input_af8607ef',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'length',
                              enable: false
                            },
                            {
                              type: 'regexp',
                              enable: false
                            },
                            {
                              type: 'repeat',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_680c0836'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_b1175ee1'
                  },
                  {
                    id: 'column_eafb0de9',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_eafb0de9'
                    },
                    children: [
                      {
                        id: 'input_a580ed62',
                        componentName: 'Input',
                        props: {
                          label: '单行文本输入59',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入文本',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: ''
                          },
                          fieldId: 'input_a580ed62',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'length',
                              enable: false
                            },
                            {
                              type: 'regexp',
                              enable: false
                            },
                            {
                              type: 'repeat',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_eafb0de9'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_b1175ee1'
                  }
                ],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'textarea_4eda54eb',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入58',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_4eda54eb',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'textarea_252d4432',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入59',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_252d4432',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'columnsgrid_795bfc5b',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_795bfc5b'
                },
                children: [
                  {
                    id: 'column_174f4607',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_174f4607'
                    },
                    children: [
                      {
                        id: 'number_35400e61',
                        componentName: 'Number',
                        props: {
                          label: '数字输入框58',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入数字',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'number_35400e61',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_174f4607'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_795bfc5b'
                  },
                  {
                    id: 'column_d3dae401',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_d3dae401'
                    },
                    children: [
                      {
                        id: 'number_0dc70336',
                        componentName: 'Number',
                        props: {
                          label: '数字输入框59',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入数字',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'number_0dc70336',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_d3dae401'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_795bfc5b'
                  }
                ],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'columnsgrid_50618b15',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_50618b15'
                },
                children: [
                  {
                    id: 'column_6ba8c631',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_6ba8c631'
                    },
                    children: [
                      {
                        id: 'money_4e162007',
                        componentName: 'Money',
                        props: {
                          label: '金额58',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入金额',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'money_4e162007',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_6ba8c631'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_50618b15'
                  },
                  {
                    id: 'column_f79a66d4',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_f79a66d4'
                    },
                    children: [
                      {
                        id: 'money_dbe2bef3',
                        componentName: 'Money',
                        props: {
                          label: '金额59',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '输入金额',
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL',
                            val: 0
                          },
                          fieldId: 'money_dbe2bef3',
                          highlight: false,
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            },
                            {
                              type: 'valueRange',
                              enable: false
                            }
                          ]
                        },
                        children: [],
                        parentInstanceKey: 'column_f79a66d4'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_50618b15'
                  }
                ],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'columnsgrid_33016edb',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_33016edb'
                },
                children: [
                  {
                    id: 'column_20f02bef',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_20f02bef'
                    },
                    children: [
                      {
                        id: 'selectdd_2fe7373d',
                        componentName: 'SelectDD',
                        props: {
                          label: '多选框58',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请选择',
                          selectddShowType: 'dropDown',
                          dataSource: {
                            dataSourceType: 'custom',
                            url: '',
                            method: '',
                            id: ''
                          },
                          options: [
                            {
                              label: '1',
                              value: '1',
                              color: '#E8F1FF'
                            },
                            {
                              label: '2',
                              value: '2',
                              color: '#FFF2F0'
                            },
                            {
                              label: '3',
                              value: '3',
                              color: '#E6FAF8'
                            },
                            {
                              label: '4',
                              value: '4',
                              color: '#FFF9DE'
                            },
                            {
                              label: '5',
                              value: '5',
                              color: '#EFE1FA'
                            }
                          ],
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'selectdd_2fe7373d',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ],
                          color: true
                        },
                        children: [],
                        parentInstanceKey: 'column_20f02bef'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_33016edb'
                  },
                  {
                    id: 'column_87f693f7',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_87f693f7'
                    },
                    children: [
                      {
                        id: 'selectdd_2846a60d',
                        componentName: 'SelectDD',
                        props: {
                          label: '多选框59',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请选择',
                          selectddShowType: 'dropDown',
                          dataSource: {
                            dataSourceType: 'custom',
                            url: '',
                            method: '',
                            id: ''
                          },
                          options: [
                            {
                              label: '1',
                              value: '1',
                              color: '#E8F1FF'
                            },
                            {
                              label: '2',
                              value: '2',
                              color: '#FFF2F0'
                            },
                            {
                              label: '3',
                              value: '3',
                              color: '#E6FAF8'
                            },
                            {
                              label: '4',
                              value: '4',
                              color: '#FFF9DE'
                            },
                            {
                              label: '5',
                              value: '5',
                              color: '#EFE1FA'
                            }
                          ],
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'selectdd_2846a60d',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ],
                          color: true
                        },
                        children: [],
                        parentInstanceKey: 'column_87f693f7'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_33016edb'
                  }
                ],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'columnsgrid_acc69590',
                componentName: 'ColumnsGrid',
                props: {
                  layout: '12:12',
                  visibility: true,
                  fieldId: 'columnsgrid_acc69590'
                },
                children: [
                  {
                    id: 'column_d7edaa27',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_d7edaa27'
                    },
                    children: [
                      {
                        id: 'select_78090fd4',
                        componentName: 'Select',
                        props: {
                          label: '单选框58',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请选择',
                          dataSource: {
                            dataSourceType: 'custom',
                            url: '',
                            method: '',
                            id: ''
                          },
                          options: [
                            {
                              label: '1',
                              value: '1',
                              color: '#E8F1FF'
                            },
                            {
                              label: '2',
                              value: '2',
                              color: '#FFF2F0'
                            },
                            {
                              label: '3',
                              value: '3',
                              color: '#E6FAF8'
                            },
                            {
                              label: '4',
                              value: '4',
                              color: '#FFF9DE'
                            },
                            {
                              label: '5',
                              value: '5',
                              color: '#EFE1FA'
                            }
                          ],
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'select_78090fd4',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ],
                          color: true
                        },
                        children: [],
                        parentInstanceKey: 'column_d7edaa27'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_acc69590'
                  },
                  {
                    id: 'column_627b6b19',
                    componentName: 'Column',
                    props: {
                      span: 12,
                      fieldId: 'column_627b6b19'
                    },
                    children: [
                      {
                        id: 'select_5685d863',
                        componentName: 'Select',
                        props: {
                          label: '单选框59',
                          layout: 'HORIZONTAL',
                          showLabel: true,
                          placeholder: '请选择',
                          dataSource: {
                            dataSourceType: 'custom',
                            url: '',
                            method: '',
                            id: ''
                          },
                          options: [
                            {
                              label: '1',
                              value: '1',
                              color: '#E8F1FF'
                            },
                            {
                              label: '2',
                              value: '2',
                              color: '#FFF2F0'
                            },
                            {
                              label: '3',
                              value: '3',
                              color: '#E6FAF8'
                            },
                            {
                              label: '4',
                              value: '4',
                              color: '#FFF9DE'
                            },
                            {
                              label: '5',
                              value: '5',
                              color: '#EFE1FA'
                            }
                          ],
                          fieldCaption: '',
                          defaultValue: {
                            mode: 'NULL'
                          },
                          fieldId: 'select_5685d863',
                          visibility: true,
                          styleMaxWidth: {
                            value: 450
                          },
                          fieldProps: [],
                          required: true,
                          validation: [
                            {
                              type: 'required',
                              enable: true
                            }
                          ],
                          color: true
                        },
                        children: [],
                        parentInstanceKey: 'column_627b6b19'
                      }
                    ],
                    parentInstanceKey: 'columnsgrid_acc69590'
                  }
                ],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'date_3d2beb82',
                componentName: 'Date',
                props: {
                  label: '日期选择58',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_3d2beb82',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'date_3e93f013',
                componentName: 'Date',
                props: {
                  label: '日期选择59',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_3e93f013',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'daterange_b78bb81e',
                componentName: 'DateRange',
                props: {
                  label: '开始时间58',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_b78bb81e',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'daterange_0977d744',
                componentName: 'DateRange',
                props: {
                  label: '开始时间59',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_0977d744',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'image_ef31aa78',
                componentName: 'Image',
                props: {
                  label: '图片46',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_ef31aa78',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'image_21a9aad0',
                componentName: 'Image',
                props: {
                  label: '图片47',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_21a9aad0',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'file_370ac727',
                componentName: 'File',
                props: {
                  label: '附件58',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_370ac727',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'file_fac735b7',
                componentName: 'File',
                props: {
                  label: '附件59',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_fac735b7',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'people_0fbf49eb',
                componentName: 'People',
                props: {
                  label: '单选人员32',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_0fbf49eb',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'people_59ab83a5',
                componentName: 'People',
                props: {
                  label: '单选人员33',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_59ab83a5',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'department_126e272e',
                componentName: 'Department',
                props: {
                  label: '部门32',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_126e272e',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'department_36c1d37d',
                componentName: 'Department',
                props: {
                  label: '部门33',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_36c1d37d',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'chatgroup_fe4dab92',
                componentName: 'ChatGroup',
                props: {
                  label: '群组32',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_fe4dab92',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'chatgroup_151123c1',
                componentName: 'ChatGroup',
                props: {
                  label: '群组33',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_151123c1',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'associatedrecord_719ea01c',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录32',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_719ea01c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'associatedrecord_42fd3961',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录33',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_42fd3961',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'associatedquery_75da2628',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询30',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_75da2628',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              },
              {
                id: 'associatedquery_aa3ec437',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询31',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_aa3ec437',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_797cbbef'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_fb726785',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_fb726785'
            },
            children: [
              {
                id: 'input_9cf31f91',
                componentName: 'Input',
                props: {
                  label: '单行文本输入56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_9cf31f91',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'input_96d19089',
                componentName: 'Input',
                props: {
                  label: '单行文本输入57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_96d19089',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'textarea_8797b8a6',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_8797b8a6',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'textarea_b91eab2b',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_b91eab2b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'number_9f6b8276',
                componentName: 'Number',
                props: {
                  label: '数字输入框56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_9f6b8276',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'number_1a3b00c6',
                componentName: 'Number',
                props: {
                  label: '数字输入框57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_1a3b00c6',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'money_3ed7677f',
                componentName: 'Money',
                props: {
                  label: '金额56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_3ed7677f',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'money_ffb38119',
                componentName: 'Money',
                props: {
                  label: '金额57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_ffb38119',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'select_2cfe1a00',
                componentName: 'Select',
                props: {
                  label: '单选框56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_2cfe1a00',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'select_49250309',
                componentName: 'Select',
                props: {
                  label: '单选框57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_49250309',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'selectdd_f1bb031d',
                componentName: 'SelectDD',
                props: {
                  label: '多选框56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_f1bb031d',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'selectdd_cd9c189c',
                componentName: 'SelectDD',
                props: {
                  label: '多选框57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '1',
                      value: '1',
                      color: '#E8F1FF'
                    },
                    {
                      label: '2',
                      value: '2',
                      color: '#FFF2F0'
                    },
                    {
                      label: '3',
                      value: '3',
                      color: '#E6FAF8'
                    },
                    {
                      label: '4',
                      value: '4',
                      color: '#FFF9DE'
                    },
                    {
                      label: '5',
                      value: '5',
                      color: '#EFE1FA'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_cd9c189c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'date_01c232c9',
                componentName: 'Date',
                props: {
                  label: '日期选择56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_01c232c9',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'date_a63b255c',
                componentName: 'Date',
                props: {
                  label: '日期选择57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_a63b255c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'daterange_8c7a5fb4',
                componentName: 'DateRange',
                props: {
                  label: '开始时间56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_8c7a5fb4',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'daterange_3629eb83',
                componentName: 'DateRange',
                props: {
                  label: '开始时间57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_3629eb83',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'image_0fc1856a',
                componentName: 'Image',
                props: {
                  label: '图片44',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_0fc1856a',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'image_0798cec7',
                componentName: 'Image',
                props: {
                  label: '图片45',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_0798cec7',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'file_f877f94b',
                componentName: 'File',
                props: {
                  label: '附件56',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_f877f94b',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'file_5b916c3e',
                componentName: 'File',
                props: {
                  label: '附件57',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_5b916c3e',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'people_6b708ef8',
                componentName: 'People',
                props: {
                  label: '单选人员30',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_6b708ef8',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'people_b50638eb',
                componentName: 'People',
                props: {
                  label: '单选人员31',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_b50638eb',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'department_73c166a1',
                componentName: 'Department',
                props: {
                  label: '部门30',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_73c166a1',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'department_f4fad773',
                componentName: 'Department',
                props: {
                  label: '部门31',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_f4fad773',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'chatgroup_9be2d4cd',
                componentName: 'ChatGroup',
                props: {
                  label: '群组30',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_9be2d4cd',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'chatgroup_bb0a73e5',
                componentName: 'ChatGroup',
                props: {
                  label: '群组31',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_bb0a73e5',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'associatedrecord_726d30da',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录30',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_726d30da',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'associatedrecord_06e6dd1b',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录31',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_06e6dd1b',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'associatedquery_ed02be42',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询28',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_ed02be42',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              },
              {
                id: 'associatedquery_9e9915e1',
                componentName: 'AssociatedQuery',
                props: {
                  label: '关联查询29',
                  fieldCaption: '',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldId: 'associatedquery_9e9915e1',
                  visibility: true,
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  displayFields: [
                    {
                      label: '单行文本输入',
                      value: 'input_0de14e25'
                    },
                    {
                      label: '多行文本输入',
                      value: 'textarea_d0687d46'
                    },
                    {
                      label: '数字输入框',
                      value: 'number_7974b799'
                    },
                    {
                      label: '金额',
                      value: 'money_3eee9d5b'
                    }
                  ],
                  recordFilterRules: '',
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_fb726785'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_96322229',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_96322229'
            },
            children: [
              {
                id: 'input_a144d87b',
                componentName: 'Input',
                props: {
                  label: '单行文本输入50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_a144d87b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'textarea_a2252475',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_a2252475',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'number_4d193680',
                componentName: 'Number',
                props: {
                  label: '数字输入框50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_4d193680',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'money_fda4b000',
                componentName: 'Money',
                props: {
                  label: '金额50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_fda4b000',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'select_10a41ff6',
                componentName: 'Select',
                props: {
                  label: '单选框50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_10a41ff6',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'selectdd_69709790',
                componentName: 'SelectDD',
                props: {
                  label: '多选框50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_69709790',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'captions_1e7fae59',
                componentName: 'Captions',
                props: {
                  label: '说明文字',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_1e7fae59',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'date_2df5e505',
                componentName: 'Date',
                props: {
                  label: '日期选择50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_2df5e505',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'daterange_99ddb94f',
                componentName: 'DateRange',
                props: {
                  label: '开始时间50',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_99ddb94f',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'table_8ce80f81',
                componentName: 'Table',
                props: {
                  label: '子表单',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_8ce80f81',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_4b7c5ab0',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_4b7c5ab0',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'textarea_c58bda6d',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_c58bda6d',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'number_4803afc6',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_4803afc6',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'money_265aa134',
                    componentName: 'Money',
                    props: {
                      label: '金额51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_265aa134',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'select_b837b374',
                    componentName: 'Select',
                    props: {
                      label: '单选框51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_b837b374',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'selectdd_30caf2c5',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_30caf2c5',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'date_9b72c4f3',
                    componentName: 'Date',
                    props: {
                      label: '日期选择51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_9b72c4f3',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'daterange_d44db5bb',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_d44db5bb',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'image_ceb074a3',
                    componentName: 'Image',
                    props: {
                      label: '图片38',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_ceb074a3',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'file_f7e67b94',
                    componentName: 'File',
                    props: {
                      label: '附件50',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_f7e67b94',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'input_e7cb069a',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_e7cb069a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'textarea_51f7e37e',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_51f7e37e',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'number_cdea6f71',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_cdea6f71',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'money_0950263f',
                    componentName: 'Money',
                    props: {
                      label: '金额52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_0950263f',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'select_b033a760',
                    componentName: 'Select',
                    props: {
                      label: '单选框52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_b033a760',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'selectdd_0f6fbbfc',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_0f6fbbfc',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'date_516a5b9f',
                    componentName: 'Date',
                    props: {
                      label: '日期选择52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_516a5b9f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'daterange_af712104',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_af712104',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'image_5d9d8032',
                    componentName: 'Image',
                    props: {
                      label: '图片39',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_5d9d8032',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  },
                  {
                    id: 'file_05fa280f',
                    componentName: 'File',
                    props: {
                      label: '附件51',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_05fa280f',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ce80f81'
                  }
                ],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'image_a7042e50',
                componentName: 'Image',
                props: {
                  label: '图片43',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_a7042e50',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'file_79345645',
                componentName: 'File',
                props: {
                  label: '附件55',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_79345645',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'people_e282ab84',
                componentName: 'People',
                props: {
                  label: '单选人员29',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_e282ab84',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'department_5078253e',
                componentName: 'Department',
                props: {
                  label: '部门29',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_5078253e',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'chatgroup_a3ffb1bc',
                componentName: 'ChatGroup',
                props: {
                  label: '群组29',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_a3ffb1bc',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              },
              {
                id: 'associatedrecord_1e5a1644',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录29',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_1e5a1644',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'number_7974b799',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_96322229'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_8198cc9d',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_8198cc9d'
            },
            children: [
              {
                id: 'input_70628fd4',
                componentName: 'Input',
                props: {
                  label: '单行文本输入53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_70628fd4',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'textarea_06f37b37',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_06f37b37',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'number_39f5dce3',
                componentName: 'Number',
                props: {
                  label: '数字输入框53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_39f5dce3',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'money_1702dfb4',
                componentName: 'Money',
                props: {
                  label: '金额53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_1702dfb4',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'select_8df8fa34',
                componentName: 'Select',
                props: {
                  label: '单选框53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_8df8fa34',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'selectdd_db85c128',
                componentName: 'SelectDD',
                props: {
                  label: '多选框53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_db85c128',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'captions_3a03a68c',
                componentName: 'Captions',
                props: {
                  label: '说明文字2',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_3a03a68c',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'date_0f9c6f39',
                componentName: 'Date',
                props: {
                  label: '日期选择53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_0f9c6f39',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'daterange_3fec7f4f',
                componentName: 'DateRange',
                props: {
                  label: '开始时间53',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_3fec7f4f',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'table_8114b0bc',
                componentName: 'Table',
                props: {
                  label: '子表单2',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_8114b0bc',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_b5fec652',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_b5fec652',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'textarea_0631beb3',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_0631beb3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'number_e07c43b8',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_e07c43b8',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'money_b1fb4ef5',
                    componentName: 'Money',
                    props: {
                      label: '金额54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_b1fb4ef5',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'select_b7cc11c6',
                    componentName: 'Select',
                    props: {
                      label: '单选框54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_b7cc11c6',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'selectdd_23b5eb98',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_23b5eb98',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'date_5c5e37fc',
                    componentName: 'Date',
                    props: {
                      label: '日期选择54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_5c5e37fc',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'daterange_7355dc5f',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间54',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_7355dc5f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'image_fbea4e7c',
                    componentName: 'Image',
                    props: {
                      label: '图片40',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_fbea4e7c',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'file_f7901427',
                    componentName: 'File',
                    props: {
                      label: '附件52',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_f7901427',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'input_43919989',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_43919989',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'textarea_10b76d53',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_10b76d53',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'number_134c137d',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_134c137d',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'money_ab3baf9a',
                    componentName: 'Money',
                    props: {
                      label: '金额55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_ab3baf9a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'select_8a5709cb',
                    componentName: 'Select',
                    props: {
                      label: '单选框55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_8a5709cb',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'selectdd_948590d2',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_948590d2',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'date_804d74d5',
                    componentName: 'Date',
                    props: {
                      label: '日期选择55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_804d74d5',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'daterange_6c2a6d31',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间55',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_6c2a6d31',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'image_6d8fc3a4',
                    componentName: 'Image',
                    props: {
                      label: '图片41',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_6d8fc3a4',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  },
                  {
                    id: 'file_506d4bad',
                    componentName: 'File',
                    props: {
                      label: '附件53',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_506d4bad',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8114b0bc'
                  }
                ],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'image_47e571a7',
                componentName: 'Image',
                props: {
                  label: '图片42',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_47e571a7',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'file_572c66cb',
                componentName: 'File',
                props: {
                  label: '附件54',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_572c66cb',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'people_8424fc65',
                componentName: 'People',
                props: {
                  label: '单选人员28',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_8424fc65',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'department_2004c6e3',
                componentName: 'Department',
                props: {
                  label: '部门28',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_2004c6e3',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'chatgroup_1658a403',
                componentName: 'ChatGroup',
                props: {
                  label: '群组28',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_1658a403',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              },
              {
                id: 'associatedrecord_f0935568',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录28',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_f0935568',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8198cc9d'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_d8959f04',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_d8959f04'
            },
            children: [
              {
                id: 'input_455cb448',
                componentName: 'Input',
                props: {
                  label: '单行文本输入91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_455cb448',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'textarea_7898ddb7',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_7898ddb7',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'number_a7d6058c',
                componentName: 'Number',
                props: {
                  label: '数字输入框91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_a7d6058c',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'money_2791607a',
                componentName: 'Money',
                props: {
                  label: '金额91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_2791607a',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'select_16a53c62',
                componentName: 'Select',
                props: {
                  label: '单选框91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_16a53c62',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'selectdd_0f260aa1',
                componentName: 'SelectDD',
                props: {
                  label: '多选框91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_0f260aa1',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'captions_712e387c',
                componentName: 'Captions',
                props: {
                  label: '说明文字12',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_712e387c',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'date_7fa9886e',
                componentName: 'Date',
                props: {
                  label: '日期选择91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_7fa9886e',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'daterange_cac15bc5',
                componentName: 'DateRange',
                props: {
                  label: '开始时间91',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_cac15bc5',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'table_bf4790df',
                componentName: 'Table',
                props: {
                  label: '子表单12',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_bf4790df',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_cc73e329',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_cc73e329',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'textarea_1a59505c',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_1a59505c',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'number_004d8343',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_004d8343',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'money_3b38d668',
                    componentName: 'Money',
                    props: {
                      label: '金额92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_3b38d668',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'select_1b295712',
                    componentName: 'Select',
                    props: {
                      label: '单选框92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_1b295712',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'selectdd_5fea9933',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_5fea9933',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'date_ff15150d',
                    componentName: 'Date',
                    props: {
                      label: '日期选择92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_ff15150d',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'daterange_87bfd80d',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_87bfd80d',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'image_313c443d',
                    componentName: 'Image',
                    props: {
                      label: '图片79',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_313c443d',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'file_1b5476c9',
                    componentName: 'File',
                    props: {
                      label: '附件91',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_1b5476c9',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'input_216e8a65',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_216e8a65',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'textarea_1b3a7e18',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_1b3a7e18',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'number_3ddee38e',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_3ddee38e',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'money_9dba2abd',
                    componentName: 'Money',
                    props: {
                      label: '金额93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_9dba2abd',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'select_e9b53e1d',
                    componentName: 'Select',
                    props: {
                      label: '单选框93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_e9b53e1d',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'selectdd_10df2f3d',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_10df2f3d',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'date_21b81329',
                    componentName: 'Date',
                    props: {
                      label: '日期选择93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_21b81329',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'daterange_2ee30c69',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间93',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_2ee30c69',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'image_fe2d7694',
                    componentName: 'Image',
                    props: {
                      label: '图片80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_fe2d7694',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  },
                  {
                    id: 'file_38917dc6',
                    componentName: 'File',
                    props: {
                      label: '附件92',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_38917dc6',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_bf4790df'
                  }
                ],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'image_b0b17726',
                componentName: 'Image',
                props: {
                  label: '图片81',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_b0b17726',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'file_85e92497',
                componentName: 'File',
                props: {
                  label: '附件93',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_85e92497',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'people_4ee92ff4',
                componentName: 'People',
                props: {
                  label: '单选人员47',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_4ee92ff4',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'department_f0bb23e6',
                componentName: 'Department',
                props: {
                  label: '部门47',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_f0bb23e6',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'chatgroup_db3c6f2f',
                componentName: 'ChatGroup',
                props: {
                  label: '群组47',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_db3c6f2f',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              },
              {
                id: 'associatedrecord_dc6035c0',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录47',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_dc6035c0',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_d8959f04'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_1b961895',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_1b961895'
            },
            children: [
              {
                id: 'input_0231d30c',
                componentName: 'Input',
                props: {
                  label: '单行文本输入88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_0231d30c',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'textarea_f4f9cbae',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_f4f9cbae',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'number_ba517130',
                componentName: 'Number',
                props: {
                  label: '数字输入框88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_ba517130',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'money_a9d3ac19',
                componentName: 'Money',
                props: {
                  label: '金额88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_a9d3ac19',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'select_3e4ba4b0',
                componentName: 'Select',
                props: {
                  label: '单选框88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_3e4ba4b0',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'selectdd_5b502c70',
                componentName: 'SelectDD',
                props: {
                  label: '多选框88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_5b502c70',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'captions_22ac94ea',
                componentName: 'Captions',
                props: {
                  label: '说明文字11',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_22ac94ea',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'date_d7dbe35f',
                componentName: 'Date',
                props: {
                  label: '日期选择88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_d7dbe35f',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'daterange_663d710c',
                componentName: 'DateRange',
                props: {
                  label: '开始时间88',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_663d710c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'table_ea58768e',
                componentName: 'Table',
                props: {
                  label: '子表单11',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_ea58768e',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_ddfc58b9',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_ddfc58b9',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'textarea_80b65383',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_80b65383',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'number_2c7a1b09',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_2c7a1b09',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'money_d325d2e3',
                    componentName: 'Money',
                    props: {
                      label: '金额89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_d325d2e3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'select_5075d40f',
                    componentName: 'Select',
                    props: {
                      label: '单选框89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_5075d40f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'selectdd_a31b6407',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_a31b6407',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'date_ae00a5e3',
                    componentName: 'Date',
                    props: {
                      label: '日期选择89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_ae00a5e3',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'daterange_5b1d781f',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_5b1d781f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'image_4960ce21',
                    componentName: 'Image',
                    props: {
                      label: '图片76',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_4960ce21',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'file_e78e60e6',
                    componentName: 'File',
                    props: {
                      label: '附件88',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_e78e60e6',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'input_a3205112',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_a3205112',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'textarea_3e9cab2d',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_3e9cab2d',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'number_4defea68',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_4defea68',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'money_360590fc',
                    componentName: 'Money',
                    props: {
                      label: '金额90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_360590fc',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'select_de8fa87a',
                    componentName: 'Select',
                    props: {
                      label: '单选框90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_de8fa87a',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'selectdd_5f044a37',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_5f044a37',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'date_b4b06f44',
                    componentName: 'Date',
                    props: {
                      label: '日期选择90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_b4b06f44',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'daterange_f5661aa3',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间90',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_f5661aa3',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'image_25858ed2',
                    componentName: 'Image',
                    props: {
                      label: '图片77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_25858ed2',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  },
                  {
                    id: 'file_577c74cb',
                    componentName: 'File',
                    props: {
                      label: '附件89',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_577c74cb',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_ea58768e'
                  }
                ],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'image_471ce721',
                componentName: 'Image',
                props: {
                  label: '图片78',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_471ce721',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'file_676a13ae',
                componentName: 'File',
                props: {
                  label: '附件90',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_676a13ae',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'people_e9ad2f07',
                componentName: 'People',
                props: {
                  label: '单选人员46',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_e9ad2f07',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'department_81c6e4ee',
                componentName: 'Department',
                props: {
                  label: '部门46',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_81c6e4ee',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'chatgroup_d652f95d',
                componentName: 'ChatGroup',
                props: {
                  label: '群组46',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_d652f95d',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              },
              {
                id: 'associatedrecord_263aeefe',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录46',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_263aeefe',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_1b961895'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_24050e9c',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_24050e9c'
            },
            children: [
              {
                id: 'input_fab0fb1b',
                componentName: 'Input',
                props: {
                  label: '单行文本输入85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_fab0fb1b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'textarea_c745a62d',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_c745a62d',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'number_1bde90e7',
                componentName: 'Number',
                props: {
                  label: '数字输入框85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_1bde90e7',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'money_1ff79d84',
                componentName: 'Money',
                props: {
                  label: '金额85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_1ff79d84',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'select_35f980d8',
                componentName: 'Select',
                props: {
                  label: '单选框85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_35f980d8',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'selectdd_ae8cfbea',
                componentName: 'SelectDD',
                props: {
                  label: '多选框85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_ae8cfbea',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'captions_25da2c3a',
                componentName: 'Captions',
                props: {
                  label: '说明文字10',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_25da2c3a',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'date_2efff27c',
                componentName: 'Date',
                props: {
                  label: '日期选择85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_2efff27c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'daterange_6998e1bd',
                componentName: 'DateRange',
                props: {
                  label: '开始时间85',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_6998e1bd',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'table_b636f676',
                componentName: 'Table',
                props: {
                  label: '子表单10',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_b636f676',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_5af5e860',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_5af5e860',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'textarea_48995a1b',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_48995a1b',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'number_d6a31c2c',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_d6a31c2c',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'money_a8f13a5b',
                    componentName: 'Money',
                    props: {
                      label: '金额86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_a8f13a5b',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'select_3a95d8e8',
                    componentName: 'Select',
                    props: {
                      label: '单选框86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_3a95d8e8',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'selectdd_6147fdec',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_6147fdec',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'date_99bc8eae',
                    componentName: 'Date',
                    props: {
                      label: '日期选择86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_99bc8eae',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'daterange_a9b59405',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_a9b59405',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'image_f3722df5',
                    componentName: 'Image',
                    props: {
                      label: '图片73',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_f3722df5',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'file_1c52861f',
                    componentName: 'File',
                    props: {
                      label: '附件85',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_1c52861f',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'input_0be42a0a',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_0be42a0a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'textarea_bd8ad0ca',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_bd8ad0ca',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'number_cf68d0d8',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_cf68d0d8',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'money_307e3a23',
                    componentName: 'Money',
                    props: {
                      label: '金额87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_307e3a23',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'select_aca79dd5',
                    componentName: 'Select',
                    props: {
                      label: '单选框87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_aca79dd5',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'selectdd_16608ea6',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_16608ea6',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'date_ead16845',
                    componentName: 'Date',
                    props: {
                      label: '日期选择87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_ead16845',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'daterange_1b2aa515',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间87',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_1b2aa515',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'image_91b7d92d',
                    componentName: 'Image',
                    props: {
                      label: '图片74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_91b7d92d',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  },
                  {
                    id: 'file_8a209a40',
                    componentName: 'File',
                    props: {
                      label: '附件86',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_8a209a40',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_b636f676'
                  }
                ],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'image_3c059bf6',
                componentName: 'Image',
                props: {
                  label: '图片75',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_3c059bf6',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'file_036665bb',
                componentName: 'File',
                props: {
                  label: '附件87',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_036665bb',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'people_d002fce5',
                componentName: 'People',
                props: {
                  label: '单选人员45',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_d002fce5',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'department_1fdddae9',
                componentName: 'Department',
                props: {
                  label: '部门45',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_1fdddae9',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'chatgroup_e71a4b47',
                componentName: 'ChatGroup',
                props: {
                  label: '群组45',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_e71a4b47',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              },
              {
                id: 'associatedrecord_08b56c34',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录45',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_08b56c34',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_24050e9c'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_9a4b2809',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_9a4b2809'
            },
            children: [
              {
                id: 'input_3bf84976',
                componentName: 'Input',
                props: {
                  label: '单行文本输入82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_3bf84976',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'textarea_5bd76699',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_5bd76699',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'number_9986094e',
                componentName: 'Number',
                props: {
                  label: '数字输入框82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_9986094e',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'money_4c7e93be',
                componentName: 'Money',
                props: {
                  label: '金额82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_4c7e93be',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'select_8072f07f',
                componentName: 'Select',
                props: {
                  label: '单选框82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_8072f07f',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'selectdd_62c41dcb',
                componentName: 'SelectDD',
                props: {
                  label: '多选框82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_62c41dcb',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'captions_aff4ce50',
                componentName: 'Captions',
                props: {
                  label: '说明文字9',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_aff4ce50',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'date_0bc41144',
                componentName: 'Date',
                props: {
                  label: '日期选择82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_0bc41144',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'daterange_81e2ccb7',
                componentName: 'DateRange',
                props: {
                  label: '开始时间82',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_81e2ccb7',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'table_c0e3e82d',
                componentName: 'Table',
                props: {
                  label: '子表单9',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_c0e3e82d',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_19661ba2',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_19661ba2',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'textarea_bf990e99',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_bf990e99',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'number_da539400',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_da539400',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'money_ec217aa0',
                    componentName: 'Money',
                    props: {
                      label: '金额83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_ec217aa0',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'select_0653ae88',
                    componentName: 'Select',
                    props: {
                      label: '单选框83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_0653ae88',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'selectdd_b52a2def',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_b52a2def',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'date_ef6c08e4',
                    componentName: 'Date',
                    props: {
                      label: '日期选择83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_ef6c08e4',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'daterange_ebd07bdc',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_ebd07bdc',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'image_7c077024',
                    componentName: 'Image',
                    props: {
                      label: '图片70',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_7c077024',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'file_d4fc0269',
                    componentName: 'File',
                    props: {
                      label: '附件82',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_d4fc0269',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'input_13d15f31',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_13d15f31',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'textarea_2e465b5e',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_2e465b5e',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'number_5dd53ff5',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_5dd53ff5',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'money_9b3b1d01',
                    componentName: 'Money',
                    props: {
                      label: '金额84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_9b3b1d01',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'select_0db5ae76',
                    componentName: 'Select',
                    props: {
                      label: '单选框84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_0db5ae76',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'selectdd_4d9e2a75',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_4d9e2a75',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'date_726ae306',
                    componentName: 'Date',
                    props: {
                      label: '日期选择84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_726ae306',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'daterange_3c053e48',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间84',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_3c053e48',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'image_1b5732bc',
                    componentName: 'Image',
                    props: {
                      label: '图片71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_1b5732bc',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  },
                  {
                    id: 'file_70ea2061',
                    componentName: 'File',
                    props: {
                      label: '附件83',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_70ea2061',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_c0e3e82d'
                  }
                ],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'image_478bacb3',
                componentName: 'Image',
                props: {
                  label: '图片72',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_478bacb3',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'file_fea0f782',
                componentName: 'File',
                props: {
                  label: '附件84',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_fea0f782',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'people_efce782c',
                componentName: 'People',
                props: {
                  label: '单选人员44',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_efce782c',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'department_c4fffdc5',
                componentName: 'Department',
                props: {
                  label: '部门44',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_c4fffdc5',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'chatgroup_a0c8afa6',
                componentName: 'ChatGroup',
                props: {
                  label: '群组44',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_a0c8afa6',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              },
              {
                id: 'associatedrecord_bed8dd09',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录44',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_bed8dd09',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_9a4b2809'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_71865806',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_71865806'
            },
            children: [
              {
                id: 'input_a2060ba3',
                componentName: 'Input',
                props: {
                  label: '单行文本输入79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_a2060ba3',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'textarea_93f6383d',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_93f6383d',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'number_752c9879',
                componentName: 'Number',
                props: {
                  label: '数字输入框79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_752c9879',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'money_e9292211',
                componentName: 'Money',
                props: {
                  label: '金额79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_e9292211',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'select_fe3878b3',
                componentName: 'Select',
                props: {
                  label: '单选框79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_fe3878b3',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'selectdd_4c2998d7',
                componentName: 'SelectDD',
                props: {
                  label: '多选框79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_4c2998d7',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'captions_b1c880ab',
                componentName: 'Captions',
                props: {
                  label: '说明文字8',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_b1c880ab',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'date_cfdda2d3',
                componentName: 'Date',
                props: {
                  label: '日期选择79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_cfdda2d3',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'daterange_f97c4ebb',
                componentName: 'DateRange',
                props: {
                  label: '开始时间79',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_f97c4ebb',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'table_70826d1b',
                componentName: 'Table',
                props: {
                  label: '子表单8',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_70826d1b',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_774bc842',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_774bc842',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'textarea_cb403ca3',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_cb403ca3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'number_d08238d5',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_d08238d5',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'money_f8bf36b7',
                    componentName: 'Money',
                    props: {
                      label: '金额80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_f8bf36b7',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'select_5ddc7e31',
                    componentName: 'Select',
                    props: {
                      label: '单选框80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_5ddc7e31',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'selectdd_3e474882',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_3e474882',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'date_61b7de90',
                    componentName: 'Date',
                    props: {
                      label: '日期选择80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_61b7de90',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'daterange_4469cfed',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_4469cfed',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'image_cd9b098e',
                    componentName: 'Image',
                    props: {
                      label: '图片67',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_cd9b098e',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'file_caa4aafd',
                    componentName: 'File',
                    props: {
                      label: '附件79',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_caa4aafd',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'input_4d52a8e3',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_4d52a8e3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'textarea_3dfbe631',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_3dfbe631',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'number_ac335092',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_ac335092',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'money_6bfb93f3',
                    componentName: 'Money',
                    props: {
                      label: '金额81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_6bfb93f3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'select_13248181',
                    componentName: 'Select',
                    props: {
                      label: '单选框81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_13248181',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'selectdd_e68d6f97',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_e68d6f97',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'date_10d274cd',
                    componentName: 'Date',
                    props: {
                      label: '日期选择81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_10d274cd',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'daterange_b43dead9',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间81',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_b43dead9',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'image_506d9a22',
                    componentName: 'Image',
                    props: {
                      label: '图片68',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_506d9a22',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  },
                  {
                    id: 'file_e1c280fa',
                    componentName: 'File',
                    props: {
                      label: '附件80',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_e1c280fa',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_70826d1b'
                  }
                ],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'image_f4ef3a07',
                componentName: 'Image',
                props: {
                  label: '图片69',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_f4ef3a07',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'file_ea7b936c',
                componentName: 'File',
                props: {
                  label: '附件81',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_ea7b936c',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'people_012a4dc9',
                componentName: 'People',
                props: {
                  label: '单选人员43',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_012a4dc9',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'department_2d920023',
                componentName: 'Department',
                props: {
                  label: '部门43',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_2d920023',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'chatgroup_15be31a4',
                componentName: 'ChatGroup',
                props: {
                  label: '群组43',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_15be31a4',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              },
              {
                id: 'associatedrecord_64836f50',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录43',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_64836f50',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_71865806'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_8c41e381',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_8c41e381'
            },
            children: [
              {
                id: 'input_448ba524',
                componentName: 'Input',
                props: {
                  label: '单行文本输入76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_448ba524',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'textarea_00e18693',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_00e18693',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'number_d00a28b3',
                componentName: 'Number',
                props: {
                  label: '数字输入框76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_d00a28b3',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'money_d23b91a1',
                componentName: 'Money',
                props: {
                  label: '金额76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_d23b91a1',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'select_d256cfcb',
                componentName: 'Select',
                props: {
                  label: '单选框76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_d256cfcb',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'selectdd_597b919b',
                componentName: 'SelectDD',
                props: {
                  label: '多选框76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_597b919b',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'captions_0a257760',
                componentName: 'Captions',
                props: {
                  label: '说明文字7',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_0a257760',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'date_d8dc2e81',
                componentName: 'Date',
                props: {
                  label: '日期选择76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_d8dc2e81',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'daterange_ebed9373',
                componentName: 'DateRange',
                props: {
                  label: '开始时间76',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_ebed9373',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'table_cf2c23f4',
                componentName: 'Table',
                props: {
                  label: '子表单7',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_cf2c23f4',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_404c55d9',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_404c55d9',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'textarea_632426a3',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_632426a3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'number_24a5d8f0',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_24a5d8f0',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'money_76cefb40',
                    componentName: 'Money',
                    props: {
                      label: '金额77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_76cefb40',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'select_a18491ed',
                    componentName: 'Select',
                    props: {
                      label: '单选框77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_a18491ed',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'selectdd_230bc6d8',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_230bc6d8',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'date_d7c07fc7',
                    componentName: 'Date',
                    props: {
                      label: '日期选择77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_d7c07fc7',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'daterange_48842a41',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_48842a41',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'image_540ace44',
                    componentName: 'Image',
                    props: {
                      label: '图片64',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_540ace44',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'file_417db3b4',
                    componentName: 'File',
                    props: {
                      label: '附件76',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_417db3b4',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'input_1027144a',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_1027144a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'textarea_8e349aa3',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_8e349aa3',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'number_ec95da8f',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_ec95da8f',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'money_dbb33210',
                    componentName: 'Money',
                    props: {
                      label: '金额78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_dbb33210',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'select_c128c1b0',
                    componentName: 'Select',
                    props: {
                      label: '单选框78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_c128c1b0',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'selectdd_6895158b',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_6895158b',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'date_5146cdcb',
                    componentName: 'Date',
                    props: {
                      label: '日期选择78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_5146cdcb',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'daterange_75134b91',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间78',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_75134b91',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'image_6df3cabb',
                    componentName: 'Image',
                    props: {
                      label: '图片65',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_6df3cabb',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  },
                  {
                    id: 'file_d851abc2',
                    componentName: 'File',
                    props: {
                      label: '附件77',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_d851abc2',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_cf2c23f4'
                  }
                ],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'image_516475ab',
                componentName: 'Image',
                props: {
                  label: '图片66',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_516475ab',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'file_6af5f5b4',
                componentName: 'File',
                props: {
                  label: '附件78',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_6af5f5b4',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'people_d5495ec1',
                componentName: 'People',
                props: {
                  label: '单选人员42',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_d5495ec1',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'department_89da81a3',
                componentName: 'Department',
                props: {
                  label: '部门42',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_89da81a3',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'chatgroup_330e3417',
                componentName: 'ChatGroup',
                props: {
                  label: '群组42',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_330e3417',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              },
              {
                id: 'associatedrecord_75786413',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录42',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_75786413',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_8c41e381'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_c1b6e908',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_c1b6e908'
            },
            children: [
              {
                id: 'input_002c8919',
                componentName: 'Input',
                props: {
                  label: '单行文本输入73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_002c8919',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'textarea_7fe946b6',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_7fe946b6',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'number_b3d52c5b',
                componentName: 'Number',
                props: {
                  label: '数字输入框73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_b3d52c5b',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'money_f064362a',
                componentName: 'Money',
                props: {
                  label: '金额73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_f064362a',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'select_d36ff7e3',
                componentName: 'Select',
                props: {
                  label: '单选框73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_d36ff7e3',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'selectdd_9aa1ab46',
                componentName: 'SelectDD',
                props: {
                  label: '多选框73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_9aa1ab46',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'captions_f81d030e',
                componentName: 'Captions',
                props: {
                  label: '说明文字6',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_f81d030e',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'date_63a009aa',
                componentName: 'Date',
                props: {
                  label: '日期选择73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_63a009aa',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'daterange_e2b0470c',
                componentName: 'DateRange',
                props: {
                  label: '开始时间73',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_e2b0470c',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'table_8ade67dd',
                componentName: 'Table',
                props: {
                  label: '子表单6',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_8ade67dd',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_acb39a5a',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_acb39a5a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'textarea_e5e0426a',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_e5e0426a',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'number_d008bdcb',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_d008bdcb',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'money_1dc13f53',
                    componentName: 'Money',
                    props: {
                      label: '金额74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_1dc13f53',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'select_d01a7834',
                    componentName: 'Select',
                    props: {
                      label: '单选框74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_d01a7834',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'selectdd_cf3a6d68',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_cf3a6d68',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'date_f03994d7',
                    componentName: 'Date',
                    props: {
                      label: '日期选择74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_f03994d7',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'daterange_8aea0fd0',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_8aea0fd0',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'image_11449cfc',
                    componentName: 'Image',
                    props: {
                      label: '图片61',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_11449cfc',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'file_c31d92f4',
                    componentName: 'File',
                    props: {
                      label: '附件73',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_c31d92f4',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'input_56360bd7',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_56360bd7',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'textarea_0c82373c',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_0c82373c',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'number_99fa836b',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_99fa836b',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'money_60eda725',
                    componentName: 'Money',
                    props: {
                      label: '金额75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_60eda725',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'select_9461c076',
                    componentName: 'Select',
                    props: {
                      label: '单选框75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_9461c076',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'selectdd_9a087a71',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_9a087a71',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'date_7caa972b',
                    componentName: 'Date',
                    props: {
                      label: '日期选择75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_7caa972b',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'daterange_48ba8e4f',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间75',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_48ba8e4f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'image_8b319988',
                    componentName: 'Image',
                    props: {
                      label: '图片62',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_8b319988',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  },
                  {
                    id: 'file_83657c79',
                    componentName: 'File',
                    props: {
                      label: '附件74',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_83657c79',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_8ade67dd'
                  }
                ],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'image_32310179',
                componentName: 'Image',
                props: {
                  label: '图片63',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_32310179',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'file_c8a9c2a8',
                componentName: 'File',
                props: {
                  label: '附件75',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_c8a9c2a8',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'people_7dd5f5bc',
                componentName: 'People',
                props: {
                  label: '单选人员41',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_7dd5f5bc',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'department_84c8f136',
                componentName: 'Department',
                props: {
                  label: '部门41',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_84c8f136',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'chatgroup_3eba69e2',
                componentName: 'ChatGroup',
                props: {
                  label: '群组41',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_3eba69e2',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              },
              {
                id: 'associatedrecord_2f27c813',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录41',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_2f27c813',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_c1b6e908'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          },
          {
            id: 'card_5e6eaa08',
            componentName: 'Card',
            props: {
              title: '分组卡片',
              visibility: true,
              expand: true,
              fieldId: 'card_5e6eaa08'
            },
            children: [
              {
                id: 'input_41340918',
                componentName: 'Input',
                props: {
                  label: '单行文本输入70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'input_41340918',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    },
                    {
                      type: 'regexp',
                      enable: false
                    },
                    {
                      type: 'repeat',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'textarea_d01307a1',
                componentName: 'TextArea',
                props: {
                  label: '多行文本输入70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入文本',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: ''
                  },
                  fieldId: 'textarea_d01307a1',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'length',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'number_1f223ae5',
                componentName: 'Number',
                props: {
                  label: '数字输入框70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入数字',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'number_1f223ae5',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'money_4171367e',
                componentName: 'Money',
                props: {
                  label: '金额70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '输入金额',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL',
                    val: 0
                  },
                  fieldId: 'money_4171367e',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    },
                    {
                      type: 'valueRange',
                      enable: false
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'select_71f8be1d',
                componentName: 'Select',
                props: {
                  label: '单选框70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '11',
                      value: 'select00aqxqy7bukho',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'select_71f8be1d',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'selectdd_9de7e8a3',
                componentName: 'SelectDD',
                props: {
                  label: '多选框70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请选择',
                  selectddShowType: 'dropDown',
                  dataSource: {
                    dataSourceType: 'custom',
                    url: '',
                    method: '',
                    id: ''
                  },
                  options: [
                    {
                      label: '111',
                      value: 'selectdd0xp2pcux2fb',
                      color: '#E8F1FF'
                    }
                  ],
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'selectdd_9de7e8a3',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ],
                  color: true
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'captions_18562242',
                componentName: 'Captions',
                props: {
                  label: '说明文字5',
                  content: '请输入说明文字',
                  link: '',
                  highlight: 'normal',
                  fieldId: 'captions_18562242',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  fieldProps: []
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'date_1cae3f4a',
                componentName: 'Date',
                props: {
                  label: '日期选择70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  fieldId: 'date_1cae3f4a',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'daterange_f0d2d052',
                componentName: 'DateRange',
                props: {
                  label: '开始时间70',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  label2: '结束时间',
                  dataRangeCalc: {
                    show: false,
                    dataRangeCalcTxt: '时长'
                  },
                  dateType: 'YYYY-MM-DD',
                  fieldCaption: '',
                  fieldId: 'daterange_f0d2d052',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  label1: '开始时间',
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'table_f5e30e3f',
                componentName: 'Table',
                props: {
                  label: '子表单5',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  caption: '',
                  fieldId: 'table_f5e30e3f',
                  tableViewType: 'table',
                  btName: '新增一行',
                  visibility: true,
                  fieldProps: []
                },
                children: [
                  {
                    id: 'input_d945c0ee',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_d945c0ee',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'textarea_6525bc0f',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_6525bc0f',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'number_b74e577c',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_b74e577c',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'money_b53d26a7',
                    componentName: 'Money',
                    props: {
                      label: '金额71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_b53d26a7',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'select_dc3dac44',
                    componentName: 'Select',
                    props: {
                      label: '单选框71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '21',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_dc3dac44',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'selectdd_ec0442da',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '222',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_ec0442da',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'date_61c9d00f',
                    componentName: 'Date',
                    props: {
                      label: '日期选择71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_61c9d00f',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'daterange_5ecfc8eb',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_5ecfc8eb',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'image_cc75108c',
                    componentName: 'Image',
                    props: {
                      label: '图片58',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_cc75108c',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'file_1c9ff92f',
                    componentName: 'File',
                    props: {
                      label: '附件70',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_1c9ff92f',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'input_69e827a5',
                    componentName: 'Input',
                    props: {
                      label: '单行文本输入72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'input_69e827a5',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        },
                        {
                          type: 'regexp',
                          enable: false
                        },
                        {
                          type: 'repeat',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'textarea_c1c21c6b',
                    componentName: 'TextArea',
                    props: {
                      label: '多行文本输入72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请输入文本',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: ''
                      },
                      fieldId: 'textarea_c1c21c6b',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'length',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'number_5551dacb',
                    componentName: 'Number',
                    props: {
                      label: '数字输入框72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入数字',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'number_5551dacb',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'money_ef391851',
                    componentName: 'Money',
                    props: {
                      label: '金额72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '输入金额',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL',
                        val: 0
                      },
                      fieldId: 'money_ef391851',
                      highlight: false,
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        },
                        {
                          type: 'valueRange',
                          enable: false
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'select_c8c5132e',
                    componentName: 'Select',
                    props: {
                      label: '单选框72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'select00aqxqy7bukho',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'select_c8c5132e',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'selectdd_7428a0e8',
                    componentName: 'SelectDD',
                    props: {
                      label: '多选框72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      placeholder: '请选择',
                      selectddShowType: 'dropDown',
                      dataSource: {
                        dataSourceType: 'custom',
                        url: '',
                        method: '',
                        id: ''
                      },
                      options: [
                        {
                          label: '22',
                          value: 'selectdd0xp2pcux2fb',
                          color: '#E8F1FF'
                        }
                      ],
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'selectdd_7428a0e8',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ],
                      color: false
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'date_da58e1c2',
                    componentName: 'Date',
                    props: {
                      label: '日期选择72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      defaultValue: {
                        mode: 'NULL'
                      },
                      fieldId: 'date_da58e1c2',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'daterange_64b6304a',
                    componentName: 'DateRange',
                    props: {
                      label: '开始时间72',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      label2: '结束时间',
                      dataRangeCalc: {
                        show: false,
                        dataRangeCalcTxt: '时长'
                      },
                      dateType: 'YYYY-MM-DD',
                      fieldCaption: '',
                      fieldId: 'daterange_64b6304a',
                      visibility: true,
                      styleMaxWidth: {
                        value: 450
                      },
                      fieldProps: [],
                      label1: '开始时间',
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'image_d4815f9c',
                    componentName: 'Image',
                    props: {
                      label: '图片59',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'image_d4815f9c',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  },
                  {
                    id: 'file_99212310',
                    componentName: 'File',
                    props: {
                      label: '附件71',
                      layout: 'HORIZONTAL',
                      showLabel: true,
                      fieldCaption: '',
                      fieldId: 'file_99212310',
                      visibility: true,
                      styleMaxWidth: {
                        value: '100%'
                      },
                      actionUrl: '/api/file/upload',
                      fieldProps: [],
                      required: true,
                      validation: [
                        {
                          type: 'required',
                          enable: true
                        }
                      ]
                    },
                    children: [],
                    parentInstanceKey: 'table_f5e30e3f'
                  }
                ],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'image_3c85947e',
                componentName: 'Image',
                props: {
                  label: '图片60',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'image_3c85947e',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'file_5947547e',
                componentName: 'File',
                props: {
                  label: '附件72',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'file_5947547e',
                  visibility: true,
                  styleMaxWidth: {
                    value: '100%'
                  },
                  actionUrl: '/api/file/upload',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'people_6ef52248',
                componentName: 'People',
                props: {
                  label: '单选人员40',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入人员姓名/mis号',
                  fieldCaption: '',
                  fieldId: 'people_6ef52248',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'department_91711406',
                componentName: 'Department',
                props: {
                  label: '部门40',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入完整的部门节点名称',
                  fieldCaption: '',
                  fieldId: 'department_91711406',
                  defaultValue: {
                    mode: 'NULL'
                  },
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'chatgroup_07f948dd',
                componentName: 'ChatGroup',
                props: {
                  label: '群组40',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  placeholder: '请输入你所在的群名称查询',
                  quickJoinRobot: false,
                  fieldCaption: '',
                  fieldId: 'chatgroup_07f948dd',
                  highlight: false,
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              },
              {
                id: 'associatedrecord_5057eb01',
                componentName: 'AssociatedRecord',
                props: {
                  label: '关联记录40',
                  layout: 'HORIZONTAL',
                  showLabel: true,
                  fieldCaption: '',
                  fieldId: 'associatedrecord_5057eb01',
                  visibility: true,
                  styleMaxWidth: {
                    value: 450
                  },
                  associatedForm: 'form-5crjkageur92iis1e3wwt',
                  mainField: 'input_0de14e25',
                  recordFilterRules: '',
                  dataFillingRules: '',
                  fieldProps: [],
                  required: true,
                  validation: [
                    {
                      type: 'required',
                      enable: true
                    }
                  ]
                },
                children: [],
                parentInstanceKey: 'card_5e6eaa08'
              }
            ],
            parentInstanceKey: 'jimuroot_b7c30dcc'
          }
        ],
        parentInstanceKey: null
      },
      dataSource: {
        online: [
          {
            id: 'associateddatasource_d7558aa1',
            name: 'associateddatasource_d7558aa1',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_394174e6',
            name: 'associateddatasource_394174e6',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_bf1bdca4',
            name: 'associateddatasource_bf1bdca4',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_22af92ca',
            name: 'associateddatasource_22af92ca',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_32a85cb6',
            name: 'associateddatasource_32a85cb6',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_74ec708e',
            name: 'associateddatasource_74ec708e',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_1b72f35f',
            name: 'associateddatasource_1b72f35f',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_3d6f63a1',
            name: 'associateddatasource_3d6f63a1',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_568ec247',
            name: 'associateddatasource_568ec247',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_e049e439',
            name: 'associateddatasource_e049e439',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_568cbba8',
            name: 'associateddatasource_568cbba8',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_b57e075b',
            name: 'associateddatasource_b57e075b',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_5481e894',
            name: 'associateddatasource_5481e894',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_ba245056',
            name: 'associateddatasource_ba245056',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_820418b7',
            name: 'associateddatasource_820418b7',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_27650e79',
            name: 'associateddatasource_27650e79',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_2b74a95a',
            name: 'associateddatasource_2b74a95a',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_da9025df',
            name: 'associateddatasource_da9025df',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_d1caad8b',
            name: 'associateddatasource_d1caad8b',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          },
          {
            id: 'associateddatasource_9775f6c2',
            name: 'associateddatasource_9775f6c2',
            loadType: 'MANUAL',
            method: 'POST',
            url: '/api/zeroconsole/connector/action/execute',
            description: '',
            type: 'remote',
            dataType: 'string',
            initData: '',
            afterFetch: 'function(response){return JSON.parse(response.data)}',
            params: {
              appCode: 'app-ixv8dxylubvngm93npi43',
              actionId: 'action-cwtjy6tg53g6fb4r8qw8p',
              actionData: {
                type: 'variable',
                variable: 'JSON.stringify({"request":{"empCode":#{input_443cdc28},"operatorUid":#{input_bdcf2958}}})',
                value: '{"request":{"empCode":null,"operatorUid":null}}'
              }
            },
            private: true
          }
        ]
      }
    }
  ],
  action: {
    source:
      '\n  /**\n    * 私有的，可复用的函数\n    * 函数面板帮助文档: \n    * @see \n    */\n  export function helloWorld(obj) {\n    console.info(obj);\n  }\n  export function onAssociatedDataSourceExec (ctx, params, fieldId, cb) {\n      var dataSource = this.dataSourceMap[fieldId];\n      return dataSource.exec({}).then(function(ret){cb(null,ret,dataSource)}).catch(function(error){cb(error,null,dataSource)});\n    }\n      ',
    type: 'FUNCTION',
    list: [
      {
        id: 'helloWorld',
        title: 'helloWorld'
      },
      {
        id: 'onAssociatedDataSourceExec',
        title: 'onAssociatedDataSourceExec'
      }
    ]
  },
  schemaVersion: '2.0.1'
};

schema500.pages[0]?.layout.children.forEach((item, index, arr) => {
  if (item.children.length) {
    item.children.forEach((v, i, acur) => {
      if (v.props.visibility) {
        if (i > 0) {
          acur[i].props.visibility = {
            type: 'formula',
            formula: '(#{number_e1e8e117}===1)',
            value: true
          };
        }
      }
    });
  } else if (item.props.visibility) {
    if (index > 0) {
      arr[index].props.visibility = {
        type: 'formula',
        formula: '(#{number_e1e8e117}===1)',
        value: true
      };
    }
  }
});

console.log(schema500);
