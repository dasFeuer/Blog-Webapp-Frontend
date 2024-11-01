import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

export const getBlogById = async (id: number) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (blogData: any) => {
  const response = await api.post('/blogs', {
    userId: blogData.userId,
    blog: {
      title: blogData.title,
      content: blogData.content
    }
  });
  return response.data;
};

export const updateBlog = async (id: number, blogData: any) => {
  const response = await api.put(`/blogs/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id: number) => {
  await api.delete(`/blogs/${id}`);
};

export const getCommentsByBlogId = async (blogId: number) => {
  const response = await api.get(`/blogs/${blogId}/comments`);
  return response.data;
};

// Updated createComment function
export const createComment = async (blogId: number, userId: number, content: string) => {
  const response = await api.post(`/blogs/${blogId}/comments`, {
      userId: userId,
      content: content,
  });
  return response.data;
};


export const getBlogsByUser = async (username: string) => {
  const response = await api.get(`/blogs/user/${username}`);
  return response.data;
};

export const getBlogsByUserId = async (userId: number) => {
  const response = await api.get(`/blogs/user/${userId}`);
  return response.data;
};

export const getAllBlogsSorted = async (page: number, size: number, sort: string) => {
  const response = await api.get('/blogs/sorted', { params: { page, size, sort } });
  return response.data;
};

export const searchBlogs = async (title: string, page: number, size: number) => {
  const response = await api.get('/blogs/search', { params: { title, page, size } });
  return response.data;
};

export const updateComment = async (blogId: number, commentId: number, content: string) => {
  const response = await api.put(`/blogs/${blogId}/comments/${commentId}`, {
    content: content
  });
  return response.data;
};

export const deleteComment = async (blogId: number, commentId: number) => {
  await api.delete(`/blogs/${blogId}/comments/${commentId}`);
};

export const registerUser = (userData: any) => api.post('/users/register', userData)
export const getUserProfile = (id: number) => api.get(`/users/${id}`)
export const updateUserProfile = (id: number, userData: any) => api.put(`/users/${id}`, userData)

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const promoteToAdmin = async (userId: number) => {
  const response = await api.put(`/admin/promote/${userId}`);
  return response.data;
};

export const demoteToUser = async (userId: number) => {
  const response = await api.put(`/admin/demote/${userId}`);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  await api.delete(`/admin/delete/${userId}`);
};
export const updateUser = async (userId: number, userData: any) => {
  
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export default api