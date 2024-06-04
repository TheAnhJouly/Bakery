import { CloseOutlined, SmallDashOutlined } from '@ant-design/icons';
import { Popconfirm, Rate, message } from 'antd';
import dayjs from 'dayjs';
import React from 'react'
import reviewService from '../../service/admin-service/reviewService';

type ReviewItemProps = {
  id: number,
  name: string,
  avatar: string,
  createdAt: string,
  rate: number,
  comment: string,
  isDeleteable?: boolean
}

export const ReviewItem = (props: ReviewItemProps) => {
  const { name, avatar, createdAt, rate, comment, isDeleteable, id } = props;
  const confirm = async () => {
    try {
      const res = await reviewService.deleteReview(id);
      if (res) {
        message.success('Delete review successfully')
        window.location.reload();
      }
      else {
        message.error('Delete review failed')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    // message.error('Click on No');
  };

  return (
    <div className='flex'>
      <img className='h-[40px] w-[40px] rounded-full ml-[10px] mr-[5px]' src={avatar} alt={avatar} />
      <div>
        <div className='flex'>
          <div >{name}</div>
          {
            isDeleteable && (
              <Popconfirm
                title="Delete the review"
                description="Are you sure to delete this review?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: 'default' }}
              >
                < CloseOutlined className='ml-4 cursor-pointer hover:bg-[#999999] rounded-full h-6 w-6 flex justify-center items-center' />
              </Popconfirm>
            )
          }
        </div>
        <Rate disabled value={rate} />
        <div className='text-[12px] pt-2'>{dayjs(createdAt.toString()).format('MMM D, YYYY h:mm A')}</div>
        <div className='py-2'>{comment}</div>
      </div>
    </div>
  )
}
