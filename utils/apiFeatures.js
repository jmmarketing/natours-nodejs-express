class APIFeatures {
  // query from mongoose, queryString from express
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    console.log(this.queryString);
    //Filter out excluded Fields
    //Express has a .query method that will put all req queries in a object
    //Note: queryObj = req.query is pass by reference, so if you change queryObj you change the main req.query. Need to hard copy with spread.
    const queryObj = { ...this.queryString };

    //Some Queries we do not want to use for filtering in our search. These are UI related
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //Loops through and deletes these queries from our req.query object
    excludedFields.forEach((field) => delete queryObj[field]);
    // console.log(req.query);

    //1a.) Advanced fields consideration (less than, greater than, etc..)
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // Field Limits (Projection)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //Pagination & limits
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
