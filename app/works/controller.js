const Course = require('../courses/model');
const Work = require('./model');

module.exports = {
  createWork: async (req, res) => {
    try {
      const { name, description, codeTest,expectedOutput } = req.body;

      const course = await Course.findOne({ _id: req.params.id }).populate(
        'author works'
      );

      const isAuthor = course?.author.some(
        (element) => element.id === req.user.id
      );

      if (!isAuthor)
        return res.status(403).json({
          status: 'FORBIDDEN',
          message: 'You are not the author of this course',
        });

      const work = await Work({
        name,
        description,
		expectedOutput,
        courseId: course._id,
        codeTest,
      });
      course.works.push(work);
      await work.save();
      await course.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully created work',
        data: work,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  getWorkById: async (req, res) => {
    try {
      const work = await Work.findById({ _id: req.params.id });

      return res.status(200).json({
        status: 'OK',
        data: work,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
