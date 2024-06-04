import { ColumnsType } from "antd/es/table"
import { Button, Table } from 'antd';
import { useEffect, useState } from "react";
import productService from "../../../service/admin-service/productService";
import { formatPrice } from "../../../utilities/formatPrice";
import { useNavigate } from "react-router-dom";

type ProductType = {
  id: number,
  name: string,
  description: string,
  price: number
  salePrice: number
  coverImage: string
  category: any,
  deletedAt: any | null
}

type ProductTable = {
  id: number,
  name: string,
  description: string,
  price: number,
  salePrice: number,
  coverImage: string,
  category: any,
  deletedAt: any | null
}

export const ProductAdminPageContainer = () => {

  const [productData, setProductData] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const navigate = useNavigate();

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    try {
      productService.getAllProductPagination(currentPage)
        .then((res) => {
          setProductData(res.data)
          setTotal(res.data.length)
        })
        .catch((err) => console.log(err))
    } catch (error) {

    }
  }, [currentPage])
  const columns: ColumnsType<ProductTable> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text: any, record: any) => {
        const data = { status: record.id };
        return (
          <div onClick={() => { navigate(`/admin/product/${record.id}`, { state: { status: data } }); }} className="underline text-baseColor cursor-pointer">{record.name}</div>
        )
      }
    },
    {
      title: 'Ảnh',
      dataIndex: 'coverImage',
      key: 'coverImage',
      align: 'center',
      render: (text: any, record: any) => (
        <img className="w-[90px]" src={record.coverImage} alt="" />
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (text: any, record: any) => (
        <p> {formatPrice(record.price)} VNĐ</p>
      )
    },
    {
      title: 'Giá khuyến mại',
      dataIndex: 'salePrice',
      key: 'salePrice',
      align: 'center',
      render: (text: any, record: any) => (
        <p> {formatPrice(record.salePrice)} VNĐ</p>
      )
    },
    {
      title: 'Loại danh mục con',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (text: any, record: any) => (
        <div>{record.category?.name}</div>
      )
    },
    {
      title: 'Miêu tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      align: 'center',
      render: (text: any, record: any) => (
        record.deletedAt === null ? <div className=" flex justify-center items-center border text-[#FFFFFF] bg-[#1E5631] p-1">OK</div> : <div className=" flex justify-center items-center border text-[#FFFFFF] bg-baseColor p-1">Deleted</div>
      )
    },
  ];



  return (
    <div className="p-2 mx-4 bg-[#FFFFFF]">
      <Button className=" mb-4" onClick={() => navigate('/admin/product/create')}>
        Tạo sản phẩm mới
      </Button>
      <Table
        dataSource={productData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: total,
          onChange: handlePageChange
        }}
      />
    </div>

  );

}
