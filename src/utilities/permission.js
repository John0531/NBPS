import F2service from '@/services/F/F2.service.js'
import C3service from '@/services/C/C3.service.js'

const Permission = {
  async defaultPermissionUIprocess (item, page) {
    let defaultPermission = null
    if (page === 'F2') {
      defaultPermission = await F2service.getDefaultPermission()
    } else if (page === 'C3') {
      defaultPermission = await C3service.getDefaultPermission()
    }
    // * 比對權限資料
    item.permissions.forEach((obj1) => {
      obj1.function.forEach((obj2) => {
        defaultPermission.forEach((obj3) => {
          obj3.function.forEach((obj4) => {
            if (obj4.pageCode === obj2.pageCode) {
              obj4.usable = obj2.usable
            }
          })
        })
      })
    })
    // * defaultPermission UI 勾選顯示
    defaultPermission.forEach((element1) => {
      element1.function.forEach((element2) => {
        if (element2.usable.length > 0) {
          element2.checked = true
          element1.checked = true
        }
      })
    })
    return defaultPermission
  },
  // ? 勾選最外面大項
  checkPermission (item) {
    if (item.checked) {
      item.function.forEach(element => {
        element.checked = true
        element.usable = element.default
      })
    } else {
      item.function.forEach(element => {
        element.checked = false
        element.usable = []
      })
    }
  },
  // ? 勾選中項
  checkPage (item2) {
    if (item2.checked) {
      item2.usable = item2.default
    } else {
      item2.usable = []
    }
  },
  // ? 勾選小項
  checkUsable (item) {
    // ? 勾選小項，對應的大項也會被勾選
    item.function.forEach((element) => {
      if (element.usable.length > 0) {
        element.checked = true
        item.checked = true
      } else {
        element.checked = false
      }
    })
    // ? 所有小項刪除，則大項刪除
    if (item.function.filter(element => element.checked).length === 0) {
      item.checked = false
    }
  }
}

export default Permission
