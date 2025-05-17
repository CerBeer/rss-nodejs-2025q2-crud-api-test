import axios, { AxiosError } from "axios";

describe("Users API", () => {

  const url = "http://localhost:3000/api/users";

  // beforeEach(async () => {
  //   await axios.patch(url, { command: "Init DB" })
  // });

  const newUser = {
    username: "First User",
    age: 19,
    hobbies: ["sit", "run"],
  };

  const updatedUser = {
    username: "Second User",
    age: 47,
    hobbies: ["sit"],
  };

  const fakeUser = {
    username: "",
    age: "19",
    hobbies: [1, 2],
  };

  const fakeID = "e653b49e-6de2-4551-bfc7-f88d1800b0bd";

  describe("Check endpoint path", () => {
    test("should return error on invalid endpoint", async () => {
      const response = await axios.get(`${url}noID`).catch((error) => { return { status: (error as AxiosError).status } });
      expect(response.status).toBe(404);
    });
  });

  describe("Get all users", () => {
    test("should return empty users array", async () => {
      const response = await axios.get(url)
        .then((response) => { return { status: response.status, body: response.data } });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("should return array with First User", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const equal = { id, ...newUser };

      const responseGet = await axios.get(url).then(response => { return { status: response.status, data: response.data } });
      expect(responseGet.status).toBe(200);
      expect(responseGet.data).toEqual([equal]);
    });
  });

  describe("Get user", () => {
    test("should return error NoId", async () => {
      const response = await axios.get(`${url}/noID`).then((response) => { return { status: response.status, error: "" } }).catch((error) => { return { status: (error as AxiosError).status, error: (error as AxiosError).response?.data } });
      expect(response.status).toBe(400);
      // expect(response.error).toEqual({ "error": "UserId is invalid (not uuid)" });
    });

    test("should return error UserIdNotFound", async () => {
      const response = await axios.get(`${url}/${fakeID}`).then((response) => { return { status: response.status, error: "" } }).catch((error) => { return { status: (error as AxiosError).status, error: (error as AxiosError).response?.data } });
      expect(response.status).toBe(404);
      // expect(response.error).toEqual({ "error": "The record with the requested ID does not exist" });
    });

    test("should return First User", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const equal = { id, ...newUser };

      const responseGet = await axios.get(`${url}/${id}`).then(response => { return { status: response.status, data: response.data } });
      expect(responseGet.status).toBe(200);
      expect(responseGet.data).toEqual(equal);
    });
  });

  describe("Create user", () => {
    test("should create new user", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const equal = { id, ...newUser };

      expect(response.data).toStrictEqual(equal);
    });

    test("should return error Invalid Data", async () => {
      const response = await axios.post(url, fakeUser).then(response => { return { status: response.status, error: "" } }).catch((error) => { return { status: (error as AxiosError).status, error: (error as AxiosError).response?.data } });
      // const equal = {"error": ["Username required", "Age must be a number", "Hobbies must be an array of strings"]};
      expect(response.status).toBe(400);
      // expect(response.error).toEqual(equal);
    });
  });

  describe("Update user", () => {
    test("should update user", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const responseUpdatedUser = await axios.put(`${url}/${id}`, updatedUser);

      expect(responseUpdatedUser.status).toBe(200);
      expect(responseUpdatedUser.data).toStrictEqual({
        id,
        ...updatedUser,
      });
    });

    test("should not update user because invalid request body", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const responseUpdatedUser = await axios.put(`${url}/${id}`, { age: "27" }).then(response => { return { status: response.status, error: "" } }).catch((error) => { return { status: (error as AxiosError).status, error: (error as AxiosError).response?.data } });

      expect(responseUpdatedUser.status).toBe(400);
      // expect(responseUpdatedUser.error).toEqual({"error": ["Age must be a number"]});
    });
  });

  describe("delete user", () => {
    test("should delete user", async () => {
      const response = await axios.post(url, newUser).then(response => { return { data: response.data } });
      const { id } = response.data;
      const responseDeleteUser = await axios.delete(`${url}/${id}`);
      expect(responseDeleteUser.status).toBe(204);

      const responseDeletedUser = await axios.get(`${url}/${id}`).then(response => { return { status: response.status, error: "" } }).catch((error) => { return { status: (error as AxiosError).status, error: (error as AxiosError).response?.data } });
      expect(responseDeletedUser.status).toBe(404);
      // expect(responseDeletedUser.error).toEqual({"error": "The record with the requested ID does not exist"});
    });
  });
});
