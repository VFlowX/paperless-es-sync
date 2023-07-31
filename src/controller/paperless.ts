import { logger } from "@services/logger";

const baseURL = process.env.PAPERLESS_URI || 'http://webserver:8000'

export async function apiFormat(endpoint: string, auth: string, method: string, body?: any, id?: undefined) {
  let urlString = `${baseURL}${endpoint}/`
  if (id) {
    urlString += `${id}/`
  }
  const url = new URL(urlString);
  const headers = new Headers();
  headers.append('Authorization', `Basic ${auth}`);
  headers.append("Accept", "application/json; version=3");
  headers.append("content-type", "application/json");
  const options: RequestInit = {
    method: method,
    headers: headers,
    redirect: 'follow'
  }
  if (body) {
    options["body"] = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(url, options)
  } catch (error) {
    logger('paperless').error(error);

  }

  // Uses the 'optional chaining' operator
  if (response?.ok) {
    const json = await response.json()
    return json
  } else {
    logger('paperless').error(`${response.status} ${response.statusText}`);
    console.log(response);
  }
  return
}
