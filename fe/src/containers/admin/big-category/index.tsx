import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import bigCategoriesService from '../../../service/admin-service/bigCategoryService';
import { useNavigate } from 'react-router';
import { TypeEnum } from './type';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} cannot be null.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: React.Key;
  name: string;
  createdAt: string;
  updatedAt: string;
}

type CategoryProps = {
  type: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const BigCategoryContainer: React.FC<CategoryProps> = ({ type }) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    bigCategoriesService.getCategoryByType(TypeEnum[type as keyof typeof TypeEnum])
      .then((res) => {
        setDataSource(res.data);
      })
      .catch((error) => console.error(error))
  }, [type])

  const handleDelete = async (id: string) => {
    const newData: DataType[] = dataSource.filter(data => data.id !== id)
    if (newData) {
      setDataSource(newData)
    }

    await bigCategoriesService.deleteBigCategory(+id);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (_, record: any) => {
        return dayjs(record.createdAt).format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      render: (_, record: any) => {
        return dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'key',
      render: (_, record: any) => {
        const handleAddCategory = () => {
          const data = { record };
          navigate(`/admin/${record.name}`, { state: { status: data } });
        }
        return (
          <div>
            {
              dataSource.length >= 1 ? (
                <div>
                  <Popconfirm okType="default" title="Do you want to delete?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="default">
                      Xóa
                    </Button>
                  </Popconfirm>
                  <Button onClick={handleAddCategory} type="default" className='ml-4'>
                    Tạo danh mục con
                  </Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
  ];

  const handleAdd = async () => {
    const newData: DataType = {
      id: -1,
      name: `Tên danh mục`,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log('newData', newData);
    console.log('dataSource', dataSource);
    console.log('newData', newData);



    setDataSource([...dataSource, newData]);
  };

  const handleSave = async (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    if (row.id === -1) {
      const res = await bigCategoriesService.createBigCategory({ name: row.name, typeId: TypeEnum[type as keyof typeof TypeEnum] });
      row.id = res.data.id;;
    } else {
      await bigCategoriesService.updateBigCategory(+row.id, row.name)
    }
    newData[index] = row;
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className='mx-4 bg-[#FFFFFF] w-[100%] p-4'>
      <div className='text-[36px] text-baseColor'>Loại sản phẩm : {type}</div>
      <button
        className="w-[200px] h-[30px] bg-white border  hover:bg-baseColor hover:text-[#FFFFFF]"
        onClick={handleAdd} style={{ marginBottom: 16 }}>
        Tạo danh mục
      </button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default BigCategoryContainer;