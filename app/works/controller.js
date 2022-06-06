const Course = require('../courses/model');
const Work = require('./model');

module.exports = {
  createWorks: async (req, res) => {
    const { name, description } = req.body;

    const course = await Course.findOne({ _id: req.params.id }).populate(
      'author'
    );

    const isAuthor = course?.author.some(
      (element) => element.id === req.user.id
    );

    if (!isAuthor)
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: 'You are not the author of this course',
      });

    const work = await Work({ name, description, course: course });
    await work.save();

    return res.status(200).json({
      status: 'OK',
      message: 'Successfully created work',
      data: work,
    });
  },
};
