
const PublicModel = {
  PostData: class Address {
    constructor () {
      this.PageInfo = { page: 1, pageSize: 10 }
      // this.Road = address?.Road || []
    }

    plus () {
      this.County++
    }

    set minus (val) {
      this.County -= val
    }

    get doubleCounty () {
      return this.County * 2
    }
  }
}

export default PublicModel
