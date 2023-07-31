import { logger } from "@services/logger";
import jwt, { JwtPayload } from "jsonwebtoken";

const endpoint = process.env.VUEJX_CORE_URL || 'http://vuejx-core:3000/vuejx/'
const login_endpoint = process.env.VUEJX_CORE_LOGIN_URL || 'http://vuejx-core:3000/login'
const login_user = process.env.VUEJX_ADMIN_USER
const login_password = process.env.VUEJX_ADMIN_PASSWORD

export async function requestVuejx(query, variables, db, site) {
  // getToken
  let token = await getToken()
  console.log('_USER', _USER);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("db", db);
  myHeaders.append("site", site);
  myHeaders.append("token", token);

  var graphql = JSON.stringify({
    query: query,
    variables: variables
  })
  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
  };



  let response;
  try {
    response = await fetch(endpoint, requestOptions)
  } catch (error) {
    logger('vuejx').error(error);
  }

  // Uses the 'optional chaining' operator
  if (response?.ok) {
    const json = await response.json()
    logger('vuejx').info(JSON.stringify(json))
    return json
  } else {
    logger('vuejx').error(`${response.status} ${response.statusText}`);
  }
  return
}


let _USER: any;
async function getToken() {
  if (_USER?.token) {
    let decoded = jwt.decode(_USER?.token) as JwtPayload
    const one_hours_miliseconds = 1000 * 60 * 60
    if ((Date.now() + one_hours_miliseconds) >= (decoded?.exp || 0) * 1000) {
      _USER = await login()
    }
  }
  else {
    _USER = await login()
  }
  return _USER?.token
}


async function login() {
  var myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("content-type", "application/json");

  var raw = JSON.stringify({
    "username": login_user,
    "password": login_password
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  let response;
  try {
    response = await fetch(login_endpoint, requestOptions)
  } catch (error) {
    logger('vuejx').error(error);
  }

  // Uses the 'optional chaining' operator
  if (response?.ok) {
    const json = await response.json()
    return json
  } else {
    logger('vuejx').error(`Login failed, status:${response?.status}, statusText:${response?.statusText}`);
  }
}