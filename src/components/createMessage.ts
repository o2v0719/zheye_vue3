/*
 * 将Message组件改写为函数调用形式
 */
import Message from './Message.vue';
import { createApp } from 'vue';
export type MessageType = 'success' | 'error' | 'default';
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  });
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  messageInstance.mount(mountNode);
  setTimeout(() => {
    // 将实例从节点卸载
    messageInstance.unmount(mountNode);
    // 移除dom
    document.body.removeChild(mountNode);
  }, timeout);
};

export default createMessage;
