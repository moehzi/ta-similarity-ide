const Course = require('./model');

module.exports = {
  createCourse: async (req, res) => {
    const { name } = req.body;
    const course = await Course({ name });
    await course.save();

    return res.status(201).json({
      status: 'OK',
      message: 'Successfully created course',
      data: course,
    });
  },
};
