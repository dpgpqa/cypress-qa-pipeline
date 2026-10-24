import type { User, Post, Comment, Album, Photo, Todo } from './types';

const API_BASE = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

export class JsonPlaceholderApi {
  private baseUrl: string;

  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  getUsers(): Cypress.Chainable<User[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/users`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as User[];
      });
  }

  getUser(id: number): Cypress.Chainable<User> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/users/${id}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as User;
      });
  }

  getPosts(): Cypress.Chainable<Post[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/posts`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Post[];
      });
  }

  getPost(id: number): Cypress.Chainable<Post> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/posts/${id}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Post;
      });
  }

  getPostsByUser(userId: number): Cypress.Chainable<Post[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/posts`,
        qs: { userId },
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Post[];
      });
  }

  getComments(postId?: number): Cypress.Chainable<Comment[]> {
    const url = postId ? `${this.baseUrl}/posts/${postId}/comments` : `${this.baseUrl}/comments`;
    return cy
      .request({
        method: 'GET',
        url,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Comment[];
      });
  }

  getAlbums(): Cypress.Chainable<Album[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/albums`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Album[];
      });
  }

  getAlbum(id: number): Cypress.Chainable<Album> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/albums/${id}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Album;
      });
  }

  getPhotos(albumId?: number): Cypress.Chainable<Photo[]> {
    const url = albumId ? `${this.baseUrl}/albums/${albumId}/photos` : `${this.baseUrl}/photos`;
    return cy
      .request({
        method: 'GET',
        url,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Photo[];
      });
  }

  getTodos(): Cypress.Chainable<Todo[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/todos`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Todo[];
      });
  }

  createPost(post: Omit<Post, 'id'>): Cypress.Chainable<Post> {
    return cy
      .request({
        method: 'POST',
        url: `${this.baseUrl}/posts`,
        body: post,
      })
      .then((response) => {
        expect(response.status).to.eq(201);
        return response.body as Post;
      });
  }

  updatePost(id: number, post: Partial<Post>): Cypress.Chainable<Post> {
    return cy
      .request({
        method: 'PUT',
        url: `${this.baseUrl}/posts/${id}`,
        body: post,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        return response.body as Post;
      });
  }

  deletePost(id: number): Cypress.Chainable<void> {
    cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/posts/${id}`,
    });
    return cy.wrap(undefined as unknown as void);
  }
}

export const jsonPlaceholderApi = new JsonPlaceholderApi();
