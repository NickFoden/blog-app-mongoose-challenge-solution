exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://nick:nickPassword@ds163360.mlab.com:63360/mongoose-blog';

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-blog-app');

exports.PORT = process.env.PORT || 8080;