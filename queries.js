// use plp_bookstore
// switched to db plp_bookstore

// 1. Find all books in a specific genre
db.books.find({genre: "Fiction"})

//2.Find books published after a certain year
db.books.find({published_year: {$gt:1930}})

//3. Find books by a specific author
db.books.find({author:"George Orwell"})

//4. Update the price of a specific book
db.books.updateOne({title:"Animal Farm"},{$set:{price: 10.50}})

//5. Delete a book by its title
db.books.deleteOne({title:"The Great Gatsby"})

//6. a query to find books that are both in stock and published after 2010
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } }
)

//7. a query to find books that are in stock and published after 1960, returning only the title, author, and price
db.books.find(
  { in_stock: true, published_year: { $gt: 1960 } },{ _id: 0, title: 1, author: 1, price: 1 }
)

// 8. sorting to display books by price in ascending order
db.books.aggregate({$sort:{price:1}})

// 9. sorting to display books by price in descending order
db.books.aggregate({$sort:{price:-1}})

// 10. skipping the first 5 books in the collection
db.books.aggregate([
  { $skip: 5 }
])
// 11. limiting the results to the first 5 books in the collection
db.books.aggregate([
  { $limit: 5 }
])

//12. an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }  
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
])

// 13. an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1 
  }
])

// 14.a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$publishedYear", 10] } }, 10] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])

//15. Creating an index on the title field for faster searches
db.books.createIndex({ title: 1 })

// 16. Creating a compound index on author and published_year for more efficient queries
db.books.createIndex({ author: 1, published_year: -1 })

// 17. Explain the execution plan for a query to find a specific book by title
db.books.find({ title: "1984" }).explain("executionStats")
