import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message, Progress } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import carouselService from '../../../service/admin-service/carouselService';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import storage from '../../../firebaseConfig';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import { SpinContainer } from '../../../components/spin-container';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export const CarouselAdminContainer = () => {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [percent, setPercent] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loadingInit, setLoadingInit] = useState(false);

  useEffect(() => {
    setLoadingInit(true);
    carouselService.getAllCarouse()
      .then((res) => {
        console.log(res.data);
        setFileList(res.data.map((data: any) => (
          {
            uid: data.id,
            name: data.name ?? `image`,
            url: data.image,
            thumbUrl: data.image
          }
        )))
        setLoadingInit(false);
      })
      .catch((err) => console.log(err));
  }, [])

  const handelRemove = (file: UploadFile) => {
    carouselService.deleteCarouse(file.uid)
      .then((res) => {
        const desertRef = ref(storage, `carousels/${file.name}`);
        deleteObject(desertRef).then(() => {
          message.success(res.data?.message);
          setFileList(fileList.filter((el) => el.uid !== file.uid));
          return true;
        }).catch((error) => {
          message.error(error);
          return false;
        })

      })
      .catch((err) => {
        message.error(err);
        return false;
      })
  }

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file, onSuccess }: RcCustomRequestOptions) => {
    setLoading(true);
    const fil = file as RcFile
    const storageRef = ref(storage, `/carousels/${fil.name}`)
    const uploadTask = uploadBytesResumable(storageRef, fil)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setPercent(percent)
      },
      (err) => {
        console.log(err);
        message.error('Failed to upload file');
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          carouselService.createCarouse({ image: url, name: fil.name })
            .then(res => {
              setFileList(fileList.concat({
                uid: res.data.id as string,
                name: fil.name,
                url: res.data.image as string
              }
              ))
              message.success('File uploaded successfully');
            })
            .catch(err => {
              message.error('Server is in trouble');
              console.log(err)
            })
            .finally(() => {
              setLoading(false);
            })
        })
      }
    )

    onSuccess?.(true);
  };

  const uploadButton = (
    <>
      <div>
        {loading ? <Progress type="circle" percent={percent} /> : <PlusOutlined className='text-[1rem]' />}

        <div style={{ marginTop: 8, fontSize: "1rem" }}>Tải lên</div>
      </div>
      <style>{
        `.ant-progress.ant-progress-circle .ant-progress-inner{
        width: 4rem !important;
        height: 4rem !important;
        font-size: 2rem !important;
      }
      .ant-progress.ant-progress-circle .ant-progress-text{
        font-size: 1rem !important;
      }
      `
      }
      </style>
    </>
  );
  if (loadingInit) return (<SpinContainer spinning={true} size="large" type='auto' width='100%' height="50vh" />)
  return (
    <>
      <div className='mx-4 bg-[] w-[100%] p-4'>
        <Upload
          name="file"
          accept='.png,.jpg,.png'
          listType="picture-card"
          fileList={fileList}
          showUploadList={true}
          customRequest={handleUpload}
          onPreview={handlePreview}
          onRemove={handelRemove}
          multiple
        >
          {uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>

      </div>
      <style>
        {
          `
        .ant-upload-list.ant-upload-list-picture-card {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          column-gap: 1.5rem;
          row-gap: 1.5rem;
          grid-column-start: 2;
          padding: 1rem;
      }
      .ant-upload-list-item-container {
        width: auto !important;
        height: 200px !important;
        background-color: white;
        border-radius: 0.6rem;
    }
    .ant-upload.ant-upload-select {
      width: auto !important;
      min-width: calc((100% - 3rem)/3);
      height: 200px !important;
  }
  .ant-upload-list.ant-upload-list-picture-card::before{
    display: none !important;
  }`
        }
      </style>
    </>
  )
}
