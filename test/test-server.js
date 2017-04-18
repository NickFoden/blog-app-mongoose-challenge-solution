const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose - require('mongoose');
const should = chai.should();

const {TEST_DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {closeServer, runServer, app} =  require('../server');

chai.use(chaiHttp);

onst blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

function generateBlogData(){
	return {
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
	}
}

function seeBlogData(){
	console.info('seeding blog data');
	const seedData = [];
	for(let i=1; i<=5; i++){
		seedData.push(generateBlogData());
	}
	return BlogPost.insertMany(seedData);
}

function tearDownDb(){
	console.warn('Deleting Database');
	return mongoose.connection.dropDatabase();
}

describe('Blog Test', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedBlogData();
	});
	afterEach(function(){
		return tearDownDb();
	});
	after(function(){
		return closeServer();
	});


}