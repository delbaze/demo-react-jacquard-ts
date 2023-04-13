import { gql } from "@apollo/client";

export const LIST_LANGUAGES = gql`
  query LanguageList {
    languageList {
      label
      id
    }
  }
`;
