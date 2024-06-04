import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { ExportOutlined } from '@ant-design/icons'
import { logoutAdmin } from '../../redux/slice/adminSlice'
import { useNavigate } from 'react-router'




const AdminHeader = () => {
  const { admin } = useSelector((state: RootState) => state.admin)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex-col bg-[#ffffff] mb-4">
      <div className="h-[80px]  flex items-center justify-between  border-b border-[#ebebeb] pl-[8%] pr-[8%]">
        <div className="text-[44px] basis-[20%]  whitespace-nowrap text-baseColor font-bold-600">
          Cake Shop
        </div>
        <div className='flex'>
          <p className="text-[#111111] text-[20px] hover:text-black whitespace-nowrap pr-4">Xin chào, {admin?.name}</p>
          <ExportOutlined className='cursor-pointer' onClick={() => {
            dispatch(logoutAdmin());
            navigate('/admin/login');
          }} />
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
