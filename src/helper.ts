import { ColumnProps } from './store';
export function generateFitUrl(
  column: ColumnProps,
  width: number,
  height: number
) {
  if (column.avatar) {
    column.avatar.fitUrl =
      column.avatar.url +
      `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`;
  } else {
    column.avatar = {
      fitUrl: require('@/assets/column.jpg')
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
