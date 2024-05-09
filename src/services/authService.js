import { http } from "../utils/axios";
import { getErrorData } from "../utils/utils";

export const signup = async (values) => {
  try {
    let response = await http.post("user/signup", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err)
  }
};

export const signin = async (values) => {
  try {
    let response = await http.post("user/login", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err)
  }
};