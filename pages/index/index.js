// index.js
Page({
  data: {
    inputValue: '',
    imageUrl: '',
    isLoading: false
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  handleGenerate() {
    if (!this.data.inputValue.trim()) {
      wx.showToast({
        title: '请输入提示词',
        icon: 'none'
      })
      return
    }

    this.setData({ isLoading: true })

    // 调用 Coze 工作流接口
    wx.request({
      url: 'https://api.coze.cn/v1/workflow/run',
      method: 'POST',
      header: {
        'Authorization': 'Bearer pat_KugEmjWTlMaLtrZGE02s433wnMeAr56fwBodgAGYw65Z4IZaTU0oB49TCH1SpVGd', // 替换为你的 PAT token
        'Content-Type': 'application/json'
      },
      data: {
        workflow_id: '7412447854465122356', // 替换为你的 workflow_id
        parameters: {
          prompt: this.data.inputValue
        }
      },
      success: (res) => {
        if (res.data.code === 0) {
          // 解析返回的数据
          try {
            const responseData = JSON.parse(res.data.data)
            this.setData({
              imageUrl: responseData.output // 假设返回的图片URL在output字段中
            })
          } catch (e) {
            wx.showToast({
              title: '解析响应失败',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg || '生成失败',
            icon: 'none'
          })
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'none'
        })
        console.error('API请求失败：', error)
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  }
})
