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

interface TestProps {
  _id: string;
  name: string;
}
/* const testData: TestProps[] = [
  { _id: '1', name: 'a' },
  { _id: '2', name: 'b' }
]; */
// 函数：把数组 => 对象
// 使用extends 关键字 给泛型施加约束
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current;
    }
    return prev;
    // 类型断言:断言为一个更具体的对象
  }, {} as { [key: string]: T });
};
/* const result = arrToObj(testData);
console.log(result);
 */
// indexable types 表示可索引类型。我们不知道对象或数组里面有哪种具体的key出现，但是可以给key一个约束，比如[key:string]
/* const testData2: { [key: string]: TestProps } = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
};
 */
export const objToArr = <T>(obj: { [key: string]: T }) => {
  // Object.keys()语法，把对象中的key抽取出来形成数组。
  return Object.keys(obj).map(key => obj[key]);
};
/* const result2 = objToArr(testData2);
console.log(result2);
 */
