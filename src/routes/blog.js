const router = require('express').Router();
const Blog = require('../models/Blog')

// Your routing code goes here


router.post('/blog', async (req, res) => {
  try {
    const { topic, description, posted_by } = req.body;
    const newBlog = new Blog({
      
      topic: topic,
      description: description,
      posted_at: new Date(),
      posted_by: posted_by
    });
    const savedBlog = await newBlog.save();
    const result = savedBlog.toObject();
    res.status(200).json({
      status: 'success',
      result: result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});


//Get request
router.get('/blog', async (req, res) => {
  try {
    const { page = 1, search } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const query = search ? { topic: new RegExp(search, 'i') } : {};
    const totalCount = await Blog.countDocuments(query);
    const results = await Blog.find(query)
      .sort({ posted_at: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean();
    res.status(200).json({
      status: 'success',
      results: results,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});




//put request to update schema
router.put('/blog/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const result = await Blog.findOneAndUpdate({ _id: id }, { ...req.body }
          ,
          {  new: true,
             runValidators: true,
          }
      )
      if (!result){
        return res.status(404).json({
          status: 'error',
          message: 'Blog not found',
        });
      }
      res.status(200).json({ status: "success", result })


  } catch (error) {
      console.log(error)
      next(error)
  }
})

  
router.delete('/blog/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const deletedBlog = await Blog.findByIdAndDelete({_id: id});
    if (!deletedBlog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      result: deletedBlog,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});


module.exports = router;