const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const {TEST_DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {closeServer, runServer, app} =  require('../server');

chai.use(chaiHttp);


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

function seedBlogData(){
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

	describe('Get endpoint', function(){
		it('should return 5 blog posts', function(){
			let res;
			return chai.request(app)
			.get('/posts')
			.then(function(_res){
				res = _res;
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(1);
				return BlogPost.count();
			})
			.then(function(count){
				res.body.should.have.length.of(count);
			});
		});
	});

	describe('Post new blogpost', function(){
		it('Should create new Blog Post', function(){
			const newPost = generateBlogData();
			return chai.request(app)
			.post('/posts')
			.send(newPost)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.title.should.equal(newPost.title);
				res.body.content.should.equal(newPost.content);
				res.body.author.should.equal(newPost.author.firstName + " " + newPost.author.lastName);
			})

		})
	})

	describe('Delete the post', function(){
		it('Should delete a post by id', function(){
			let deletedPost;
			return BlogPost
				.findOne()
				.exec()
				.then(function(post){
					deletedPost = post;
					return chai.request(app)
						.delete(`/posts/${deletedPost.id}`)
				})
				.then(function(res){
					res.should.have.status(204)
					return BlogPost
					.findById(deletedPost.id)
					.exec()
				})
				.then(function(post){
					should.not.exist(post)
				})
		})
	})
});

/*onst blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});*/










//End