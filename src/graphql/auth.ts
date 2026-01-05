import { gql } from '@apollo/client'

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      token
      error
      user {
        id
        name
        email
        role
        color
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      token
      error
      user {
        id
        name
        email
        role
        color
      }
    }
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
      color
    }
  }
`
