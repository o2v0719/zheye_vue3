import { ColumnProps, ImageProps, UserProps } from './store';
// 计算适应设备的图片大小
export function generateFitUrl(
  data: ImageProps,
  width: number,
  height: number,
  format = ['m_pad']
) {
  if (data && data.url) {
    // 字符串，支持在不同红设备改变图片大小
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev;
    }, '');
    data.fitUrl =
      data.url +
      `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`;
  }
}
// 给栏 增加头像
export function addColumnAvatar(
  data: ColumnProps | UserProps,
  width: number,
  height: number
) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height);
  } else {
    const parseCol = data as ColumnProps;
    data.avatar = {
      fitUrl: require(parseCol.title
        ? '@/assets/column.jpg'
        : '@/assets/avatar.jpg')
    };
  }
}
// 限制上传文件格式和大小的接口
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null;
//  创建文章最后，检查文件。限制条件。

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  // 检查文件类型是否合法。传上去的照片合法吗？
  const isValidFormat = format ? format.includes(file.type) : true;
  //  传上去的文件大小合法吗？
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = 'format';
  }
  if (!isValidSize) {
    error = 'size';
  }
  // 返回一个对象，是否通过验证，如果没有通过验证报什么错误。
  return {
    passed: isValidFormat && isValidSize,
    error
  };
}
