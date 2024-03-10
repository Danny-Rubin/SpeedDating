/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
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
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
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
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
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
