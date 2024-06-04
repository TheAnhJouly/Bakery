import { Button, Drawer, Form, Input, Rate, message } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CloseOutlined } from '@ant-design/icons'
import reviewService from '../../service/reviewService'
import { ReviewItem } from './ReviewItem'
import { ReviewItemProps } from './type'

type ReviewProps = {
  productId: number,
  userId?: number,
  isAdmin?: boolean,
}

type ReviewRequest = {
  rate: number,
  comment: string
}


export const Review = (props: ReviewProps) => {
  const { productId, userId, isAdmin } = props
  const [open, setOpen] = useState(false)
  const [reviewData, setReviewData] = useState<ReviewItemProps[]>();
  console.log('reviewData', reviewData);

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const { control, getValues, handleSubmit, formState: { errors } } = useForm();
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onSubmit = useCallback(async () => {
    const data = getValues();

    const submitData = {
      comment: `${data.comment}`,
      rate: +data.rate,
      productId: productId,
      userId: props.userId!,
    }

    try {
      const res = await reviewService.createReview(submitData);
      if (res) {
        message.success('Your review has been created');
        window.location.reload();
      }
      else {
        message.error('You can not create a review')
      }
    } catch (error) {
    }

  }, [getValues, productId, props.userId])

  useEffect(() => {
    reviewService.getReviewsByProductId(productId)
      .then((res) => setReviewData(res.data))
      .catch((err) => console.log('error', err));
  }, [productId])

  return (
    <div>
      <div className='text-[20px] pb-2'>
        Đánh giá sản phẩm
      </div>
      {
        reviewData?.map((data: any) => (
          <ReviewItem id={data.id} isDeleteable={isAdmin} name={data.userId.name} avatar={data.userId.avatar} createdAt={data.createdAt} rate={data.rate} comment={data.comment} />
        ))
      }
      {
        isAdmin === true ? null : <div>
          <Button className='w-[20%] mt-2' type="default" onClick={() => {
            showDrawer();

          }} >
            Viết đánh giá
          </Button>
        </div>
      }


      <Drawer
        title={
          <div className="flex items-center">
            <span className="text-[20px]">REVIEW PRODUCT</span>
            <CloseOutlined
              onClick={onClose}
              className="absolute right-4 cursor-pointer text-[#a4a4a4] hover:text-[#000000]"
            />
          </div>
        }
        closable={false}
        placement="right"
        onClose={onClose}
        open={open}
        size='large'
        rootClassName=""
      >
        <div className='flex-col'>
          <Form.Item
            // label={<div className="w-[50px]">Email</div>}
            className='py-2'
            help={<div>{!!errors && <div className="alert mt-1">{errors.rate?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="rate"
              rules={{
                required: 'Please choose a rate'
              }}
              render={({ field: { value, onChange } }) => (
                <div >
                  Your rating: <span>
                    <Rate tooltips={desc} onChange={onChange} value={value} />
                    {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
                  </span>
                </div>
              )}
            />
          </Form.Item>

          <Form.Item
            className='py-2'
            help={<div>{!!errors && <div className="alert mt-1">{errors.comment?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="comment"
              rules={{
                required: 'Please write your comment'
              }}
              render={({ field: { value, onChange } }) => (
                <div className=''>
                  Your comment:
                  <Input.TextArea value={value} onChange={onChange} className='mb-4 mt-2' />
                </div>
              )}
            />
          </Form.Item>


        </div>

        <div className="flex ">
          <button
            onClick={handleSubmit(onSubmit)}
            className="w-fit h-[50px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
          >
            <p>SUBMIT</p>
          </button>
        </div>
      </Drawer>
    </div>
  )
}
