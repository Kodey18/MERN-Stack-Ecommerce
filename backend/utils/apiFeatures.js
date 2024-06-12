class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        // above queryStr is receviing the req.query that has the keyword.
        const keyword = this.queryStr.keyword ? {
            // name : {
            //     $regex: this.queryStr.keyword,
            //     $options: 'i', // here 'i' means case insensitive.
            // },
            $or: [
                { name: { $regex: this.queryStr.keyword, $options: 'i' } },
                { description: { $regex: this.queryStr.keyword, $options: 'i' } }
            ]
        } : {};

        //here this.query contains the "Product.find()" that was
        this.query = this.query.find({...keyword});
        return this
    }

    // Filter functionality
    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove fields from query
        const removeFields = ['keyword', 'page', 'limit'];
        removeFields.forEach(param => delete queryCopy[param]);
        console.log(queryCopy); 

        // Advanced filtering for price, rating, etc.
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
}

module.exports= ApiFeatures;