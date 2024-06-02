import axios from 'axios';

const instance = axios.create({

    baseURL: process.env.REACT_APP_KV_REST_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.REACT_APP_KV_REST_API_TOKEN}`,
    },
});


const kv = (data) => {
    return new Promise((resolve, reject) => {
        instance.post('', data)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    })
};

export default kv;