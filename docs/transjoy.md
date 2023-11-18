# 传乐(TransJoy)

## 数据格式

文件标识JSON:

```JSON
// file
{
    "id": "uuid",
	"deviceId": "xxx-xxx-xxx",
	"type": "file",
    "content": {
        "fileName": "xxx.jpg",
        "fileType": "jpg",
        "filePath": "/c/ss/vv/xxx.jpg",
        "fileSize": 2000
    },
    "timestamp": "2023-07-15 15:50",
}

// message
{
    "id": "uuid",
	"deviceId": "xxx-xxx-xxx",
	"type": "msg",
    "content": "I have a pen.",
    "timestamp": "2023-07-15 15:50",
}
```

设备标识JSON:

```json
{
	"id": "xxx-xxx-xxx",
    "ip": "192.168.0.105",
    "port": 54188,
    "username": "bulv"
}
```





## ISSUE

1. 图片无法加载时处理空占位



## 升级任务项

1. 检查更新

2. 消息通知

3. 删除当前所有记录

4. 删除当前对话记录

5. 恢复出厂

6. 设备在线校验

7. 文件拖拽发送

8. 多文件支持

   

