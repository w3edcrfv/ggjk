/* global qiniu */
import api from 'api'

class Uploader {
  constructor(opts) {
    // 确保opts是对象，避免undefined问题
    this.opts = {
      browse_button: null,
      multi_selection: false,
      auto_start: false,
      mime_types: [],
      type_max_file_size: {},
      ...opts
    }
    
    this._up = {
      setOption: (key, value) => {
        if (typeof key === 'object') {
          // 支持传入对象批量设置
          Object.assign(this.opts, key);
        } else {
          // 单个键值对设置
          this.opts[key] = value;
        }
        // 如果修改了过滤器相关配置，重新初始化过滤器
        if (['mime_types', 'type_max_file_size', 'max_file_size'].includes(key)) {
          this._initFilters();
        }
      }
    }
    
    this.token = ''
    this.domain = ''
    this.files = {}
    this.subscriptions = {}
    this.listeners = {}
    this.fileInput = null // 存储文件输入元素
    this.handleBrowseClick = null;
    
    // 初始化文件过滤器
    this._initFilters()
    
    // 绑定上传按钮事件（如果提供）
    if (this.opts.browse_button) {
      this._bindBrowseButton()
    }
  }
  
  addFile(file) {
    const checkResult = this._checkFile(file);
    if (!checkResult.valid) {
      this._trigger('Error', file, {code: checkResult.code, file, message: checkResult.message}, {message: checkResult.message} );
      // this._trigger('Error', {
      //   code: -1,
      //   message: checkResult.message,
      //   file
      // });
      return;
    }

    const fileItem = this._createFileItem(file);
    this._trigger('FilesAdded', this, [fileItem]);

    if (this.opts.auto_start) {
      this.start(fileItem.id);
    }
  }
  
  // 显式定义init方法，解决init is not a function问题
  init() {
    // 初始化逻辑
    return this
  }
  
  // 初始化文件过滤器
  _initFilters() {
    this.filters = {
      typeFilters: this.opts.mime_types || [],
      typeMaxFileSize: this.opts.type_max_file_size || {},
      maxFileSize: this.opts.max_file_size
    }
  }
  
  // 绑定上传按钮点击事件
  _bindBrowseButton() {
    let browseButton;
    const browseBtn = this.opts.browse_button;
  
    // 1. 获取原按钮元素
    if (Array.isArray(browseBtn) || browseBtn instanceof NodeList) {
      browseButton = browseBtn[0] || null;
    } else if (browseBtn && browseBtn.nodeType === 1) {
      browseButton = browseBtn;
    } else if (typeof browseBtn === 'string') {
      browseButton = document.querySelector(browseBtn);
    }
  
    if (!browseButton || browseButton.nodeType !== 1) {
      console.warn('未找到有效的上传按钮');
      return;
    }
  
    // 2. 获取父级元素并设置position: relative
    const parentElement = browseButton.parentNode;
    if (parentElement) {
      const currentPosition = window.getComputedStyle(parentElement).position;
      if (!['relative', 'absolute', 'fixed'].includes(currentPosition)) {
        parentElement.style.position = 'relative';
      }
    } else {
      console.warn('上传按钮没有父级元素，无法创建覆盖层');
      return;
    }
  
    // 3. 获取原按钮的尺寸和位置信息
    const buttonRect = browseButton.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(browseButton);
  
    // 4. 创建新按钮并设置为与原按钮尺寸一致
    const newButton = document.createElement('div');
    
    // 添加指定类名
    newButton.className = 'moxie-shim';
    
    // 关键样式：尺寸与原按钮一致，位置覆盖原按钮
    newButton.style.cssText = `
      position: absolute;
      top: ${buttonRect.top - parentElement.getBoundingClientRect().top}px;
      left: ${buttonRect.left - parentElement.getBoundingClientRect().left}px;
      width: ${buttonRect.width}px;
      height: ${buttonRect.height}px;
      z-index: 10;
      opacity: 0;
      cursor: pointer;
      box-sizing: ${computedStyle.boxSizing}; /* 继承盒模型，确保尺寸一致 */
    `;
  
    // 5. 插入到原按钮同级（覆盖在原按钮上方）
    browseButton.parentNode.insertBefore(newButton, browseButton.nextSibling);
  
    // 6. 存储引用并绑定点击事件
    this.browseButton = newButton;
    this.handleBrowseClick = (e) => {
      e.preventDefault();
      this._createFileInput();
    };
    this.browseButton.addEventListener('click', this.handleBrowseClick);
  }
  
  // 创建文件输入元素
  _createFileInput() {
    // 移除已存在的输入元素
    if (this.fileInput) {
      document.body.removeChild(this.fileInput)
    }
    
    // 创建新的文件输入
    this.fileInput = document.createElement('input')
    this.fileInput.type = 'file'
    this.fileInput.multiple = this.opts.multi_selection
    
    // 设置可接受的文件类型
    if (this.filters.typeFilters.length) {
      this.fileInput.accept = this.filters.typeFilters
        .flatMap(item => item.extensions.split(',').map(ext => `.${ext}`))
        .join(',')
    }
    
    // 隐藏输入元素
    this.fileInput.style.display = 'none'
    document.body.appendChild(this.fileInput)
    
    // 监听文件选择
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        this._handleFiles(e.target.files)
      }
      // 移除输入元素，确保下次点击能重新触发
      document.body.removeChild(this.fileInput)
      this.fileInput = null
    })
    
    // 触发点击
    this.fileInput.click()
  }
  
  // 处理选择的文件
  _handleFiles(fileList) {
    const files = Array.from(fileList)
    const validFiles = []
    const invalidFiles = []
    
    // 验证文件
    files.forEach(file => {
      const check = this._checkFile(file)
      if (check.valid) {
        validFiles.push(file)
      } else {
        invalidFiles.push({ file, error: check.message, code: check.code })
      }
    })
    
    // 触发错误事件
    invalidFiles.forEach(({ file, error, code }) => {
      this._trigger('Error', file, {code: code, file}, {message: error} );
      // this._trigger('Error', {
      //   code: -1,
      //   message: error,
      //   file
      // })
    })
    
    // 处理有效文件
    if (validFiles.length) {
      const fileItems = validFiles.map(file => this._createFileItem(file))
      this._trigger('FilesAdded', this, fileItems)
      
      // 自动上传
      if (this.opts.auto_start) {
        this.start()
      }
    }
  }
  
  // 创建文件项
  _createFileItem(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    
    const fileItem = {
      id: fileId,
      file,
      name: file.name,
      ext,
      size: file.size,
      percent: 0,
      uploaded: false,
      uploading: false,
      localURL: this._getThumbnail(file, ext)
    }
    
    this.files[fileId] = fileItem
    return fileItem
  }
  
  // 获取缩略图
  _getThumbnail(file, ext) {
    if (!['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(ext)) {
      return `//static.chaodp.com/chao_build/icon_unknown.svg`
    }
    return URL.createObjectURL(file)
  }
  
  // 检查文件有效性
  _checkFile(file) {
    // 检查文件名特殊字符
    if (/\?|&|=/.test(file.name)) {
      return { valid: false, message: '文件名不能包含 ?, &, = 等特殊字符', code: -1 }
    }
    
    // 检查文件类型
    const ext = file.name.split('.').pop().toLowerCase()
    const allowedExts = this.filters.typeFilters
      .flatMap(item => item.extensions.split(',').map(e => e.toLowerCase()))
    
    if (allowedExts.length && !allowedExts.includes(ext)) {
      return { valid: false, message: `不支持的文件格式：${ext}，支持的格式：${allowedExts.join(',')}`, code: -1 }
    }
    
    // 检查文件大小
    const typeMaxSize = this.filters.typeMaxFileSize
    const typeKeys = Object.keys(typeMaxSize)
    
    if (typeKeys.length) {
      const matchedType = typeKeys.find(keys => 
        keys.split(',').map(k => k.toLowerCase()).includes(ext)
      )
      
      if (matchedType && file.size > typeMaxSize[matchedType]) {
        const maxSizeMB = (typeMaxSize[matchedType] / (1024 * 1024)).toFixed(1)
        return { valid: false, message: `文件大小超过限制，最大支持 ${maxSizeMB}MB`, code: -600 }
      }
    }
    
    return { valid: true }
  }
  
  // 获取七牛Token
  async fetchToken() {
    if (this.token) return this.token
    
    try {
      const { data } = await api.qiniuToken()
      this.token = data.token
      this.domain = data.url
      return this.token
    } catch (error) {
      this._trigger('Error', {
        code: -100,
        message: '获取上传凭证失败，请稍后重试',
        error
      })
      throw error
    }
  }
  
  // 开始上传
  async start(fileId) {
    try {
      // 确保获取到Token
      await this.fetchToken()
      
      // 确定要上传的文件
      const filesToUpload = fileId 
        ? [this.files[fileId]].filter(Boolean)
        : Object.values(this.files).filter(f => !f.uploaded && !f.uploading)
      
      // 开始上传每个文件
      filesToUpload.forEach(fileItem => this._uploadFile(fileItem))
    } catch (error) {
      console.error('上传初始化失败:', error)
    }
  }
  
  // 上传单个文件
  _uploadFile(fileItem) {
    if (!fileItem || fileItem.uploading || fileItem.uploaded) return
    
    fileItem.uploading = true
    
    // 生成文件Key
    const key = this._generateKey(fileItem)
    
    // 七牛上传配置
    const putExtra = {
      fname: fileItem.name,
      params: {},
      mimeType: null
    }
    
    const config = {
      useCdnDomain: true,
      region: qiniu.region.z0 // 根据实际区域调整
    }
    
    // 创建上传可观察对象
    const observable = qiniu.upload(
      fileItem.file,
      key,
      this.token,
      putExtra,
      config
    )
    
    // 订阅上传事件
    const subscription = observable.subscribe({
      next: (res) => {
        fileItem.percent = Math.round(res.total.percent)
        this._trigger('UploadProgress', this, fileItem)
      },
      error: (err) => {
        fileItem.uploading = false
        this._trigger('Error', {
          code: err.code || -200,
          message: err.message || '上传失败',
          file: fileItem
        })
        delete this.subscriptions[fileItem.id]
      },
      complete: (res) => {
        console.log("res1", res)
        fileItem.uploading = false
        fileItem.uploaded = true
        fileItem.key = res.key
        let tmpFile = fileItem.file ? fileItem.file : fileItem
        this._trigger('FileUploaded', this, tmpFile, JSON.stringify(res))
        delete this.subscriptions[fileItem.id]
        
        // 检查是否全部上传完成
        this._checkAllComplete()
      }
    })
    
    // 保存订阅，用于取消上传
    this.subscriptions[fileItem.id] = subscription
  }
  
  // 检查是否所有文件都已上传完成
  _checkAllComplete() {
    const allCompleted = Object.values(this.files).every(f => 
      f.uploaded || !f.uploading
    )
    if (allCompleted) {
      this._trigger('UploadComplete', this)
    }
  }
    
  // 生成文件key（可通过事件自定义）
  _generateKey(fileItem) {
    if (this.listeners.key) {
      return this.listeners.key(this, fileItem)
    }
    let ext = fileItem.name.replace(/.*\./, '')
    return this.md5(`${Date.now()}_${fileItem.name}`) + "." + ext // 默认用时间戳+文件名
  }

  /**
   * MD5 哈希函数实现
   * @param {string|ArrayBuffer} input 输入内容（字符串或二进制数据）
   * @return {string} 32位小写MD5哈希值
   */
  md5(input) {
      // 处理输入：字符串转UTF-8编码的二进制数组
      if (typeof input === 'string') {
          input = unescape(encodeURIComponent(input)); // 转UTF-8
      } else if (input instanceof ArrayBuffer) {
          input = new Uint8Array(input);
      } else if (!(input instanceof Uint8Array)) {
          throw new Error('不支持的输入类型');
      }

      // 常量定义
      const K = [
          0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
          0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
          0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
          0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
          0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
          0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
          0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
          0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
          0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
          0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
          0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
          0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
          0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
          0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
          0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
          0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
      ];

      const s = [
          7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
          5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
          4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
          6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
      ];

      // 初始化寄存器
      let a0 = 0x67452301;
      let b0 = 0xefcdab89;
      let c0 = 0x98badcfe;
      let d0 = 0x10325476;

      // 处理输入数据：填充
      let bytes = typeof input === 'string' 
          ? input.split('').map(c => c.charCodeAt(0)) 
          : Array.from(input);
      
      const originalLength = bytes.length * 8; // 原始长度（位）
      bytes.push(0x80); // 添加填充位

      // 填充到 56 字节（448位）模 64 字节（512位）
      while (bytes.length % 64 !== 56) {
          bytes.push(0x00);
      }

      // 添加原始长度（64位，小端序）
      for (let i = 0; i < 8; i++) {
          bytes.push((originalLength >>> (8 * i)) & 0xff);
      }

      // 分块处理（每块64字节）
      for (let i = 0; i < bytes.length; i += 64) {
          const chunk = bytes.slice(i, i + 64);
          const M = [];
          for (let j = 0; j < 16; j++) {
              M[j] = 
                  (chunk[j * 4] << 24) |
                  (chunk[j * 4 + 1] << 16) |
                  (chunk[j * 4 + 2] << 8) |
                  chunk[j * 4 + 3];
          }

          let A = a0, B = b0, C = c0, D = d0;

          // 4轮循环
          for (let j = 0; j < 64; j++) {
              let F, g;
              if (j < 16) {
                  F = (B & C) | (~B & D);
                  g = j;
              } else if (j < 32) {
                  F = (D & B) | (~D & C);
                  g = (5 * j + 1) % 16;
              } else if (j < 48) {
                  F = B ^ C ^ D;
                  g = (3 * j + 5) % 16;
              } else {
                  F = C ^ (B | ~D);
                  g = (7 * j) % 16;
              }

              const temp = D;
              D = C;
              C = B;
              B = B + this.leftRotate((A + F + K[j] + M[g]) >>> 0, s[j]);
              A = temp;
          }

          a0 = (a0 + A) >>> 0;
          b0 = (b0 + B) >>> 0;
          c0 = (c0 + C) >>> 0;
          d0 = (d0 + D) >>> 0;
      }

      return this.toHex(a0) + this.toHex(b0) + this.toHex(c0) + this.toHex(d0);
  }

  // 转换为十六进制字符串
  toHex(x) {
      const hex = (x >>> 0).toString(16).padStart(8, '0');
      return hex;
  }

  // 辅助函数：循环左移
  leftRotate(x, n) {
      return (x << n) | (x >>> (32 - n));
  }
  
  // 取消上传
  cancelUpload(fileId) {
    if (this.subscriptions[fileId]) {
      this.subscriptions[fileId].unsubscribe()
      delete this.subscriptions[fileId]
    }
    if (this.files[fileId]) {
      this.files[fileId].uploading = false
    }
  }
  
  // 移除文件
  removeFile(fileId) {
    this.cancelUpload(fileId)
    if (this.files[fileId]) {
      // 释放URL对象
      if (this.files[fileId].localURL) {
        URL.revokeObjectURL(this.files[fileId].localURL)
      }
      delete this.files[fileId]
    }
    this._trigger('QueueChanged', this)
  }
  
  // 清空文件
  clearFiles() {
    // 取消所有上传
    Object.keys(this.subscriptions).forEach(id => {
      this.subscriptions[id].unsubscribe()
    })
    
    // 释放所有URL对象
    Object.values(this.files).forEach(file => {
      if (file.localURL) {
        URL.revokeObjectURL(file.localURL)
      }
    })
    
    this.files = {}
    this.subscriptions = {}
    this._trigger('QueueChanged', this)
  }
  
  // 绑定事件
  bind(event, callback) {
    if (typeof callback === 'function') {
      this.listeners[event] = callback
    }
  }
  
  // 触发事件
  _trigger(event, ...args) {
    if (this.listeners[event]) {
      try {
        this.listeners[event](...args)
      } catch (error) {
        console.error(`Event ${event} handler error:`, error)
      }
    }
  }
  
  // 销毁实例
  destroy() {
    this.clearFiles()
    this.listeners = {}
    this.token = ''
    this.domain = ''
    
    if (this.browseButton && this.handleBrowseClick) {
      this.browseButton.removeEventListener('click', this.handleBrowseClick);
    }
    
    // 清理其他资源（如覆盖层、文件输入框等）
    if (this.browseButton && this.browseButton.parentNode) {
      this.browseButton.parentNode.removeChild(this.browseButton);
    }
    if (this.fileInput && this.fileInput.parentNode) {
      this.fileInput.parentNode.removeChild(this.fileInput)
    }
    
    // 清空引用，帮助垃圾回收
    this.browseButton = null;
    this.handleBrowseClick = null;
    this.fileInput = null
  }
}

export default Uploader
