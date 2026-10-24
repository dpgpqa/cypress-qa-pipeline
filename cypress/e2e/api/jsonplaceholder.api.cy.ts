/// <reference types="cypress" />

import { jsonPlaceholderApi } from '@api/JsonPlaceholderApi';
import type { User, Post, Comment } from '@api/types';

describe('@api JSONPlaceholder API', () => {
  it('should get all users', () => {
    jsonPlaceholderApi.getUsers().then((users: User[]) => {
      expect(users).to.be.an('array');
      expect(users.length).to.be.greaterThan(0);
      expect(users[0]).to.have.property('id');
      expect(users[0]).to.have.property('name');
      expect(users[0]).to.have.property('email');
    });
  });

  it('should get single user by id', () => {
    jsonPlaceholderApi.getUser(1).then((user: User) => {
      expect(user.id).to.eq(1);
      expect(user.name).to.be.a('string');
      expect(user.email).to.include('@');
    });
  });

  it('should get all posts', () => {
    jsonPlaceholderApi.getPosts().then((posts: Post[]) => {
      expect(posts).to.be.an('array');
      expect(posts.length).to.eq(100);
      expect(posts[0]).to.have.property('userId');
      expect(posts[0]).to.have.property('title');
      expect(posts[0]).to.have.property('body');
    });
  });

  it('should get single post by id', () => {
    jsonPlaceholderApi.getPost(1).then((post: Post) => {
      expect(post.id).to.eq(1);
      expect(post.userId).to.eq(1);
      expect(post.title).to.be.a('string');
    });
  });

  it('should get posts by user', () => {
    jsonPlaceholderApi.getPostsByUser(1).then((posts: Post[]) => {
      expect(posts).to.be.an('array');
      posts.forEach((post) => {
        expect(post.userId).to.eq(1);
      });
    });
  });

  it('should get comments for a post', () => {
    jsonPlaceholderApi.getComments(1).then((comments: Comment[]) => {
      expect(comments).to.be.an('array');
      expect(comments.length).to.be.greaterThan(0);
      comments.forEach((comment) => {
        expect(comment.postId).to.eq(1);
        expect(comment.email).to.include('@');
      });
    });
  });

  it('should get all albums', () => {
    jsonPlaceholderApi.getAlbums().then((albums) => {
      expect(albums).to.be.an('array');
      expect(albums.length).to.eq(100);
    });
  });

  it('should get all photos', () => {
    jsonPlaceholderApi.getPhotos().then((photos) => {
      expect(photos).to.be.an('array');
      expect(photos.length).to.eq(5000);
    });
  });

  it('should get all todos', () => {
    jsonPlaceholderApi.getTodos().then((todos) => {
      expect(todos).to.be.an('array');
      expect(todos.length).to.eq(200);
      todos.forEach((todo) => {
        expect(todo).to.have.property('completed');
        expect(typeof todo.completed).to.eq('boolean');
      });
    });
  });

  it('should create a post', () => {
    const newPost = {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1,
    };
    jsonPlaceholderApi.createPost(newPost).then((post: Post) => {
      expect(post.id).to.eq(101);
      expect(post.title).to.eq(newPost.title);
      expect(post.body).to.eq(newPost.body);
      expect(post.userId).to.eq(newPost.userId);
    });
  });

  it('should update a post', () => {
    const updatedPost = {
      title: 'Updated Test Post',
      body: 'This is an updated test post body',
    };
    jsonPlaceholderApi.updatePost(1, updatedPost).then((post: Post) => {
      expect(post.id).to.eq(1);
      expect(post.title).to.eq(updatedPost.title);
      expect(post.body).to.eq(updatedPost.body);
    });
  });

  it('should delete a post', () => {
    jsonPlaceholderApi.deletePost(1).then(() => {
      // Delete returns 200 with empty body
    });
  });
});
