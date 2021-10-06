import axios from 'axios'
const baseUrl = '/api/persons'
// const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(res => res.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(res => res.data)
}

const removePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then((response) => response.data);
  };

const updatePerson = (id, person) => {
  const request = axios.put(`${baseUrl}/${id}`, person)
  return request.then((response) => response.data)
}
  export default {
    getAll: getAll,
    create: create,
    delete: removePerson,
    update: updatePerson 
  };
  