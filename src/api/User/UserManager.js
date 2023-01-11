import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import Discord, { Client } from "discord.js";
const { User } = Discord;

export class UserManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * 
   * @param {string} userID 
   * @returns {Promise<User>}
   */
  async get(userID) {
    const userChecker = new api.checker.BaseChecker(userID);
    userChecker.createError(!userChecker.isString, "userId", { expected: "String", received: userChecker }).throw();

    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${userID}`);

    const user = await client.users.fetch(fetched.id);

    return user;
  };
};