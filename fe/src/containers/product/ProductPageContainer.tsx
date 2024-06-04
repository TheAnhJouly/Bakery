import { DownOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { TreeProps } from 'antd/es/tree'
import { useCallback, useEffect, useState } from 'react'
import ProductItem from '../../components/item/Item'
import typeService from '../../service/typeService'
import { Tree } from 'antd'
import { useLocation } from 'react-router'
import { ProductData, ProductType } from './type'
import productService from '../../service/productService'
import { Key } from 'antd/lib/table/interface'

type SelectedOptionType = {
  bigCategory?: string
  category?: string
  price?: {
    maxPrice: number
    minPrice: number
  }
}

type TPriceFiler = {
  minPrice: number,
  maxPrice: number,
}

const ProductPageContainer = () => {
  const location = useLocation()
  const path = location.pathname.replace('/', '')

  const [treeData, setTreeData] = useState([])
  const [productData, setProductData] = useState<ProductData[]>([])
  const [filterOption, setFilterOption] = useState<SelectedOptionType>()
  const [filterData, setFilterData] = useState<ProductData[]>([])
  const [priceFilter, setPriceFilter] = useState<TPriceFiler>({
    minPrice: 0,
    maxPrice: 0
  })

  const defaultSelectedKeys = [] as Key[];
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  const handleExpand = (expandedKeys: Key[]) => {
    setExpandedKeys(expandedKeys);
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setFilterOption(getValueFromKey(selectedKeys[0]))
  }

  const getValueFromKey = (key: any) => {
    const [bigCategory, category] = key.split('-')
    if (category) {
      return { category: category }
    } else {
      return { bigCategory: bigCategory }
    }
  }

  const buildTreeData = useCallback((data: any, parentId = '') => {
    return data.map((item: any) => {
      const id = parentId ? `${parentId}-${item.id}` : `${item.id}`
      const node = {
        key: id,
        title: item.name,
        children: item.categories ? buildTreeData(item.categories, id) : undefined,
      }
      return node
    })
  }, [])

  const filterProducts = (price: TPriceFiler) => {
    const filteredProducts = productData.filter(product => {
      if (product.price > product.salePrice) {
        if (product.salePrice < price.minPrice! || product.salePrice > price.maxPrice!) {
          return false;
        }
      }
      else if (product.price < price.minPrice! || product.price > price.maxPrice!) {
        return false;
      }

      return true;
    });

    setFilterData(filteredProducts)
  }



  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let id = queryParams.get("id");
    console.log(id);
    if (id) {
      defaultSelectedKeys.push(id);
      setExpandedKeys([id.split('-')[0]]);
    }
    // Simulate an API call to fetch the data
    const fetchCategoryData = async () => {
      const response = await typeService.getTypeById((Object.keys(ProductType).indexOf(path) + 1).toString())

      const data = response.data.big_categories

      // Transform the data into the format expected by the Tree component
      const transformedData = buildTreeData(data)

      setTreeData(transformedData)
    }
    fetchCategoryData()

    const fetchProductData = async () => {
      if (id) {
        productService.getProductByCategory(+(id.split('-')[1]))
          .then(res => {
            setProductData(res.data);
            setFilterData(res.data);
            queryParams.delete('id');
            const newUrl = window.location.pathname + '?' + queryParams.toString();
            window.history.pushState({ path: newUrl }, '', newUrl);
          })
          .catch((errors) => console.log(errors))
      } else
        if (filterOption?.bigCategory) {
          productService.getProductByBigCategory(+filterOption?.bigCategory).then((res) => {
            setProductData(res.data);
            setFilterData(res.data)
          })
        } else if (filterOption?.category) {
          productService.getProductByCategory(+filterOption?.category).then((res) => {
            setProductData(res.data);
            setFilterData(res.data)
          })
        } else {
          productService
            .getProductByType(Object.keys(ProductType).indexOf(path) + 1)
            .then((res) => {
              setProductData(res.data);
              setFilterData(res.data)
            })
        }
    }

    fetchProductData()
  }, [buildTreeData, filterOption?.bigCategory, filterOption?.category, path])

  const handleOnChangeMinPrice = (event: any) => {
    setPriceFilter({
      ...priceFilter,
      minPrice: event.target.value
    })
  }

  const handleOnChangeMaxPrice = (event: any) => {
    setPriceFilter({
      ...priceFilter,
      maxPrice: event.target.value
    })
  }

  return (
    <div>
      {/* {path === 'men' && <img className="h-[300px] w-full object-cover object-top" src={bannerMen} alt="" />}
      {path === 'women' && <img className="h-[300px] w-full object-cover object-top" src={bannerWomen} alt="" />}
      {path === 'kids' && <img className="h-[300px] w-full object-cover  object-top" src={bannerKids} alt="" />} */}
      <div className="flex pl-[8%] pr-[8%] bg-[#FFFFFF] pt-[12vh] pb-[4vh]">
        <div className="basis-[20%] ">
          <div className="text-[36px] ">Cửa hàng</div>
          <div className="text-[20px] mt-6">Kết quả tìm kiếm: {filterData.length === 1 ? filterData.length + ' sản phẩm' : filterData.length + ' sản phẩm'} </div>
          <div className="text-[28px] mt-6">Tìm kiếm theo: </div>
          <div className="text-[24px] mt-2">Loại danh mục: </div>
          <div className='py-2'>
            <Tree
              defaultExpandAll
              style={{ fontSize: '16px' }}
              showIcon
              onSelect={onSelect}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
              defaultSelectedKeys={defaultSelectedKeys}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
            />
          </div>
          <div className=''>
            <div className="text-[24px]">Giá: </div>
            <div className='flex py-2'>
              <input type='number' className='border w-[80px] pl-2' defaultValue={priceFilter.minPrice} onChange={(event) => handleOnChangeMinPrice(event)} />
              <div className='px-3'>đến</div>
              <input type='number' className='border w-[80px] pl-2' defaultValue={priceFilter.maxPrice} onChange={(event) => handleOnChangeMaxPrice(event)} />
            </div>
          </div>
          <button
            className="px-4 mt-2 mr-6 h-[50px] w-[200px] border bg-baseColor text-[#FFFFFF]  duration-300"
            onClick={() => filterProducts(priceFilter)}
          >
            <p>Lọc</p>
          </button>
        </div>
        <div className="basis-[80%]">
          <div className="text-[36px]">Sản phẩm: </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="pr-2 pl-2">
            {filterData.map((data) => (
              <Col className="gutter-row " span={6}>
                <ProductItem
                  text='string'
                  sizes={data.sizes}
                  salePrice={data.salePrice}
                  description={data.description}
                  slug="1"
                  id={data.id}
                  coverImage={data.coverImage}
                  name={data.name}
                  price={data.price}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default ProductPageContainer
