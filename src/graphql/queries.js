/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
      session_id
      generation_timestamp
      is_active
      user1
      user1WantsToExtendMeeting
      user2
      user2WantsToExtendMeeting
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMatches = /* GraphQL */ `
  query ListMatches(
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        session_id
        generation_timestamp
        is_active
        user1
        user1WantsToExtendMeeting
        user2
        user2WantsToExtendMeeting
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
