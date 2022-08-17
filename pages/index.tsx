import type { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";

import { useGetUser } from "../utils/queries/users";
import { useInput } from "../utils/common/useInputSelect";
import {
  useAppSelector,
  useAppDispatch,
} from "../utils/common/useReduxToolkit";
import { statusesSelector, statusesAction } from "../redux/modules/statuses";
import {
  categoriesSelector,
  categoriesAction,
} from "../redux/modules/categories";
import { orderSelector, orderAction } from "../redux/modules/order";
import {
  heartOrderSelector,
  heartOrderAction,
} from "../redux/modules/heartOrder";
import {
  isHeartListOnSelector,
  isHeartListOnAction,
} from "../redux/modules/isHeartListOn";
import {
  isSearchListOnSelector,
  isSearchListOnAction,
} from "../redux/modules/isSearchListOn";
import {
  searchValueSelector,
  searchValueAction,
} from "../redux/modules/searchValue";
import { getDebates } from "../api/debates";

import HomeAndTopBtn from "../components/common/btn/HomeAndTopBtn";
import Filters from "../components/debates/debates/Filters";
import LikeBtn from "../components/debates/debates/LikeBtn";
import DebatesHeartList from "../components/debates/debates/DebatesHeartList";
import DebatesList from "../components/debates/debates/DebatesList";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const statuses = useAppSelector<string[]>(statusesSelector);
  const setStatuses = (params: string[]) => {
    dispatch(statusesAction(params));
  };
  const categories = useAppSelector<string[]>(categoriesSelector);
  const setCategories = (params: string[]) => {
    dispatch(categoriesAction(params));
  };
  const order = useAppSelector<string>(orderSelector);
  const setOrder = (params: string) => {
    dispatch(orderAction(params));
  };
  const heartOrder = useAppSelector<string>(heartOrderSelector);
  const setHeartOrder = useCallback(
    (params: string) => {
      dispatch(heartOrderAction(params));
    },
    [dispatch],
  );
  const isHeartListOn = useAppSelector<boolean>(isHeartListOnSelector);
  const setIsHeartListOn = useCallback(
    (params: boolean) => {
      dispatch(isHeartListOnAction(params));
    },
    [dispatch],
  );
  const isSearchListOn = useAppSelector<boolean>(isSearchListOnSelector);
  const setIsSearchListOn = (params: boolean) => {
    dispatch(isSearchListOnAction(params));
  };
  const searchValue = useAppSelector<string>(searchValueSelector);
  const setSearchValue = useCallback(
    (params: string) => {
      dispatch(searchValueAction(params));
    },
    [dispatch],
  );

  const search = useInput(searchValue, "");

  const user = useGetUser();

  useEffect(() => {
    setSearchValue(search.value);
  }, [search.value, setSearchValue]);

  useEffect(() => {
    if (!user.data) {
      setHeartOrder("DESC");
      setIsHeartListOn(false);
    }
  }, [setHeartOrder, setIsHeartListOn, user.data]);

  return (
    <div className="inner">
      <HomeAndTopBtn isHomeBtnOn={false} />
      <Filters
        statuses={statuses}
        setStatuses={setStatuses}
        categories={categories}
        setCategories={setCategories}
      />
      <LikeBtn
        isHeartListOn={isHeartListOn}
        setIsHeartListOn={setIsHeartListOn}
      />
      {isHeartListOn ? (
        <DebatesHeartList
          search={search}
          statuses={statuses}
          categories={categories}
          order={heartOrder}
          setOrder={setHeartOrder}
          isSearchListOn={isSearchListOn}
          setIsSearchListOn={setIsSearchListOn}
        />
      ) : (
        <DebatesList
          search={search}
          statuses={statuses}
          categories={categories}
          order={order}
          setOrder={setOrder}
          isSearchListOn={isSearchListOn}
          setIsSearchListOn={setIsSearchListOn}
        />
      )}
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery(["debates"], () =>
    getDebates("", "0", "DESC"),
  );
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
