import Spin, { SpinProps } from 'antd/lib/spin'

type SpinContainerProps = {
  height?: string
  width?: string
  type?: 'full-screen' | 'full-container' | 'auto'
} & SpinProps

export const SpinContainer = ({ type = 'auto', height = '12px', width = '12px', ...props }: SpinContainerProps) => {
  return (
    <>
      <div className="spin-container">
        <Spin {...props} />
      </div>
      <style>
        {`
          .spin-container {
            position: ${type === 'full-screen' ? 'fixed' : type === 'full-container' ? 'absolute' : 'static'};
            top: 0;
            right: 0;
            z-index: 999;
            height: ${type === 'auto' ? height : '100%'};
            width: ${type === 'auto' ? width : 'calc(100% - 256px)'};
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 100%;
          }
        `}
      </style>
    </>
  )
}