/* global APP_CONFIG */
/* global API_GATEWAY_TOKEN */
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { HttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

import Auth from './auth';

const base = APP_CONFIG.api.url;
const httpLink = new HttpLink({
  uri: `${base}/graphql`,
  credentials: 'same-origin'
});
const batchHttpLink = new BatchHttpLink({
  uri: `${base}/graphql`,
  credentials: 'same-origin'
});
const persistedQueryLink = createPersistedQueryLink();

const withToken = setContext((_, { headers }) => {
  const token = Auth.getToken();
  return {
    headers: {
      ...headers,
      auth: token ? `Bearer ${token}` : ''
    }
  };
});

const resetToken = onError(res => {
  if (res.graphQLErrors) {
    const [networkError] = res.graphQLErrors;
    if (networkError && networkError.message === 'Unauthenticated!') {
      Auth.clearToken();
    }
  }
  // need to handle this more gracefully
  // eslint-disable-next-line no-console
  if (res.networkError) console.warn(`Error: Cannot connect to API`);
});

const authLink = withToken.concat(resetToken);
const serverLink = persistedQueryLink.concat(httpLink);
const serverLinkWithBatch = persistedQueryLink.concat(batchHttpLink);

export default new ApolloClient({
  connectToDevTools: process.browser,
  shouldBatch: true,
  link: split(operation => operation.getContext().slow === true, ApolloLink.from([authLink, serverLink]), ApolloLink.from([authLink, serverLinkWithBatch])),
  cache: new InMemoryCache()
});

export const restAPI = async payload => {
  const { path, method, body, cType, header, isDownload, fileName } = payload;
  const url = `${base}/${path}`;
  const contentType = cType || 'application/json';
  const bodyJson = contentType === 'application/json' ? JSON.stringify(body) : body;
  const defaultHeaders = {
    'Content-Type': `${contentType}`,
    // Authorization: `Bearer ${Auth.getToken()}`,
    token: API_GATEWAY_TOKEN
  };

  if (contentType === 'multipart/form-data') delete defaultHeaders['Content-Type'];

  const headers = { ...defaultHeaders, ...header };
  const response = await fetch(url, { method, body: bodyJson, headers });
  const clone = response.clone();
  if (isDownload && response.status < 400) {
    const blob = await response.blob();
    if (blob.type === 'application/json') {
      return await clone.json();
    }
    const url = window.URL.createObjectURL(
      new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    return { success: true };
  }
  const responseBody = response.json();

  // TODO: Set this to the returned response error message
  if (response.status >= 400) {
    const errorResponse = await responseBody;
    throw Error(errorResponse.message);
  }
  return responseBody;
};
