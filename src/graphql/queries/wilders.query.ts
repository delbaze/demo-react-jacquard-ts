import { gql } from "@apollo/client";

export const LIST_WILDERS = gql`
  query WilderList {
    wilderList {
      id
      first_name
      email
      last_name
      avatar
      notes {
        id
        note
        language {
          label
        }
      }
    }
  }
`;

export const FIND_WILDER = gql`
  query FindWilder($findWilderId: String!) {
    findWilder(id: $findWilderId) {
      email
      first_name
      id
      last_name
      notes {
        id
        note
        language {
          label
          id
        }
      }
      avatar
    }
  }
`;
