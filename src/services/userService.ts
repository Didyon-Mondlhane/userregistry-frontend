import axios from './api';
import { User } from '../types/User';

export const getUsers = async (search = '', page = 1) => {
  return axios.get(`/users?search=${search}&page=${page}`);
};

export const getUserById = async (id: string): Promise<User> => {
  return axios.get(`/users/${id}`).then(res => res.data);
};

export const createUser = async (user: Omit<User, 'id'>) => {
  return axios.post('/users', user);
};

export const updateUser = async (id: string, user: User) => {
  return axios.put(`/users/${id}`, user);
};