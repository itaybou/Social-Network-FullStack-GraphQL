import React, { useCallback, useMemo, useState } from "react";
import {
  SearchPanel,
  SearchPanelChoice,
  SearchPanelVariant,
} from "react-search-panel";
import { gql, useLazyQuery } from "@apollo/client";

import LeftNav from "../components/LeftNav";
import PopularPosts from "../components/PopularPosts";
import { debounce } from "lodash";
import { useHistory } from "react-router-dom";

const SEARCH_USERS_QUERY = gql`
  query SEARCH_USERS_QUERY($searchInput: String!) {
    search_users(searchInput: $searchInput) {
      id
      name
      profile {
        avatar
      }
    }
  }
`;

interface SearchUser {
  id: string;
  name: string;
  profile: {
    avatar: string;
  };
}

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const history = useHistory();

  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncing, setDebouncing] = useState<boolean>(false);
  const [choices, setChoices] = useState([]);

  const [search, { loading, error }] = useLazyQuery(SEARCH_USERS_QUERY, {
    variables: { searchInput: searchInput.trim() },
    onCompleted: (data) => {
      setChoices(
        (data?.search_users ?? []).map((user: SearchUser) => {
          return { key: user.id, description: user.name };
        })
      );
    },
  });

  const searchByInput = (searchInput: string) => {
    setDebouncing(true);
    debounce(() => {
      search({ variables: { searchInput } });
      setDebouncing(false);
    }, 500)();
  };

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div>
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <SearchPanel
              className="no-scroll"
              maximumHeight={100}
              small
              choices={choices}
              isLoading={loading || debouncing}
              onChange={(e) => {
                const value = (e as React.ChangeEvent<HTMLInputElement>).target
                  .value;
                setSearchInput(value);
                searchByInput(value);
              }}
              clearLabel={"Clear"}
              onClear={() => {
                setSearchInput("");
                setChoices([]);
              }}
              onSelectionChange={(selected) => {
                history.push(`/user/${selected[0].key}`);
                setSearchInput("");
                setChoices([]);
              }}
              placeholder="Search Users"
              value={searchInput}
              variant={SearchPanelVariant.link}
            />
          </div>
          {children}
        </div>
        <div className="right">
          <PopularPosts />
        </div>
      </div>
    </>
  );
}

export default Layout;
