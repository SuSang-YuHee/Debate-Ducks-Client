import type { NextPage } from "next";
import { useCallback, useEffect } from "react";
import _ from "lodash";

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
import {
  scrollMainSelector,
  scrollMainAction,
} from "../redux/modules/scrollMain";

import HomeAndTopBtn from "../components/common/btn/HomeAndTopBtn";
import Filters from "../components/debates/debates/Filters";
import LikeBtn from "../components/debates/debates/LikeBtn";
import DebatesHeartList from "../components/debates/debates/DebatesHeartList";
import DebatesList from "../components/debates/debates/DebatesList";

const Home: NextPage = () => {
  //# 전역 변수
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
  const scrollY = useAppSelector<number>(scrollMainSelector);
  const setScrollY = useCallback(
    (params: number) => {
      dispatch(scrollMainAction(params));
    },
    [dispatch],
  );

  //# 검색
  const search = useInput(searchValue, "");

  useEffect(() => {
    setSearchValue(search.value);
  }, [search.value, setSearchValue]);

  //# 서버 정보 (유저)
  const user = useGetUser();

  //# 로그아웃 시 초기화
  useEffect(() => {
    if (!user.data) {
      setHeartOrder("DESC");
      setIsHeartListOn(false);
    }
  }, [setHeartOrder, setIsHeartListOn, user.data]);

  //# 스크롤 위치 기억
  //> 스크롤 저장
  const handleSetScrollY = () => {
    if (globalThis.location.pathname === "/") setScrollY(window.pageYOffset);
  };

  //> 스크롤 이동
  useEffect(() => {
    if (scrollY !== 0) window.scrollTo(0, scrollY);
  }, [scrollY]);

  //> 스크롤 감지
  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", _.debounce(handleSetScrollY, 100));
    };
    watch();
    return () => {
      window.removeEventListener("scroll", _.debounce(handleSetScrollY, 100));
    };
  });

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
