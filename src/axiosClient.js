import axios from "axios";

export const axiosClient = axios.create({
    baseURL:  `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const { response } = error;
    console.log(error.response);
    if (response && response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
    }
    return Promise.reject(error);
});




export const hubStaffClient = axios.create({
    baseURL:  `${import.meta.env.VITE_API_HUBSTAFF_BASE_URL}/v2`,
});


hubStaffClient.interceptors.request.use(function (config) {
    
    const token = localStorage.getItem('HUBSTAFF_ACCESS_AND_REFRESH_TOKEN');

    if (JSON.parse(token)) {
        config.headers.Authorization = `Bearer ${JSON.parse(token).access_token}`;
    }
    return config;
 
   
});

hubStaffClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const { response } = error;
    console.log(error.response);
    if (response && response.status === 401) {
        localStorage.removeItem('HUBSTAFF_ACCESS_AND_REFRESH_TOKEN');
    }
    return Promise.reject(error);
});


export default axiosClient;
