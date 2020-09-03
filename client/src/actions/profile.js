import axios from "axios";
import {setAlert} from "./alert";

import {
  GET_PROFILE,
  PROFILE_ERROR
} from "./types";

// get current user profile

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");

  } catch (err) {

  }
}