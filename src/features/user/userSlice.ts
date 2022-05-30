import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { Users, Result } from "../../types/users";

interface InitialStateTypes {
  users: Users[];
  userMale: Users[];
  userFemale: Users[];
  userSearchResult: any[];
  status: "idle" | "loading" | "success" | "failed";
  error: any;
  keyword: string;
  isSearch: boolean;
}

const initialState: InitialStateTypes = {
  users: [],
  userMale: [],
  userFemale: [],
  userSearchResult: [],
  status: "idle",
  error: null,
  keyword: "",
  isSearch: false,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    searchUserByKeyword: (state, action) => {
      let filterFromUsers: Result[] = [];
      let filterFromUsersMale: Result[] = [];
      let filterFromUsersFemale: Result[] = [];
      let results: Result[] = [];

      const { keyword, gender } = action.payload;
      console.log({ gender });

      if (!gender) {
        for (let u of state.users) {
          filterFromUsers = [
            ...filterFromUsers,
            ...u.results.filter((user) =>
              user.login.username.startsWith(keyword.toLowerCase())
            ),
          ];
        }
      }

      if (state.userMale.length > 0 && gender === "male") {
        for (let u of state.userMale) {
          filterFromUsersMale = [
            ...filterFromUsersMale,
            ...u.results.filter((user) =>
              user.login.username.startsWith(keyword.toLowerCase())
            ),
          ];
        }
      }

      if (state.userFemale.length > 0 && gender === "female") {
        for (let u of state.userFemale) {
          filterFromUsersFemale = [
            ...filterFromUsersFemale,
            ...u.results.filter((user) =>
              user.login.username.startsWith(keyword.toLowerCase())
            ),
          ];
        }
      }

      results = [
        ...results,
        ...filterFromUsers,
        ...filterFromUsersMale,
        ...filterFromUsersFemale,
      ];

      // let chunk: any[];
      if (results.length > 10) {
        for (let i = 0; i < results.length; i += 10) {
          let chunk = results.slice(i, i + 10);
          state.userSearchResult = chunk;
        }
      } else {
        state.userSearchResult = results;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users.push(action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUsersByGender.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsersByGender.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload?.gender === "male") {
          state.userMale.push(action.payload.data);
        } else {
          state.userFemale.push(action.payload?.data);
        }
      })
      .addCase(fetchUsersByGender.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { searchUserByKeyword } = userSlice.actions;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number = 1) => {
    try {
      const response = await api.get("api", {
        params: {
          page: page,
          results: 10,
          inc: "login,name,email,gender,registered",
          seed: "foobar",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchUsersByGender = createAsyncThunk(
  "users/fetchUsersByGender",
  async (
    params: { page: number; gender: string } = { page: 1, gender: "" }
  ) => {
    const { page, gender } = params;
    try {
      const response = await api.get("api", {
        params: {
          page: page,
          results: 10,
          inc: "login,name,email,gender,registered",
          gender: gender,
        },
      });
      return { gender: gender, data: response.data };
    } catch (error) {
      console.log(error);
    }
  }
);

export default userSlice.reducer;
