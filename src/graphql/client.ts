import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:5001/graphql',
})

// Auth middleware to add token to requests
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('auth_token')

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
