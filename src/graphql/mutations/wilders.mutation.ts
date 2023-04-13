import { gql } from "@apollo/client";

export const CREATE_WILDER = gql`
  mutation CreateWilder($wilderCreate: WilderInput!) {
    createWilder(wilderCreate: $wilderCreate) {
      email
      first_name
      id
      last_name
      avatar
    }
  }
`;

export const UPDATE_WILDER = gql`
  mutation UpdateWilder($updateWilder: UpdateWilder!) {
    updateWilder(updateWilder: $updateWilder) {
      id
      last_name
      email
      avatar
      first_name
      notes {
        note
        id
        language {
          id
          label
        }
      }
    }
  }
`;

export const DELETE_WILDER = gql`
  mutation DeleteWilder($deleteWilderId: String!) {
    deleteWilder(id: $deleteWilderId) {
      message
      success
    }
  }
`;
