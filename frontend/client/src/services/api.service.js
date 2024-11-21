import axios from "axios";

const commonConfig = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const formConfig = {
  "Content-Type": "multipart/form-data",
}

export default (baseURL, useFormConfig = false) => {
  const headers = useFormConfig 
    ? { ...formConfig }
    : { ...commonConfig };

  return axios.create({
    baseURL,
    headers,
  });
};
