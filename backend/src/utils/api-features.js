class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  filter() {
    const filterObject = { ...this.queryString };
    const removeFromFilter = ["limit", "page", "sort", "fields", "keyword"];

    removeFromFilter.forEach((field) => delete filterObject[field]);

    let filterString = JSON.stringify(filterObject);
    filterString = filterString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    filterString = filterString.replace(
      /"([^"]+)\[(\$[a-z]+)\]":"([^"]+)"/g,
      '"$1":{"$2":"$3"}',
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(filterString));
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(numberofDocuments) {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (page - 1) * limit;

    const pagination = {};
    pagination.currentPage = +page;
    pagination.numberOfPages = Math.ceil(numberofDocuments / limit);

    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  keywordSearch(modelName) {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
        { name: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  // keywordSearch(modelName) {
  //   if (this.queryString.keyword) {
  //     const query = {};
  //     if (modelName === "products") {
  //       query.$or = [
  //         { title: { $regex: this.queryString.keyword, $options: "i" } },
  //         { description: { $regex: this.queryString.keyword, $options: "i" } },
  //       ];
  //     } else {
  //       query.$or = [
  //         { name: { $regex: this.queryString.keyword, $options: "i" } },
  //       ];
  //     }
  //     this.mongooseQuery = this.mongooseQuery.find(query);
  //   }
  //   return this;
  // }
}

export default ApiFeatures;
