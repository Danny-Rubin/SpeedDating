/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onCreateMatch(filter: $filter) {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onUpdateMatch(filter: $filter) {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch($filter: ModelSubscriptionMatchFilterInput) {
    onDeleteMatch(filter: $filter) {
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
