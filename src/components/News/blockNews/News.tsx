import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../../../redux-toolkit/store';
import {
  loadAllPosts,
  loadPostsByTag,
  loadAllTags,
  addBookmark,
  removeBookmark,
  addLike,
  removeLike,
  addShare,
} from '../../../redux-toolkit/postsSlice';
import { IDataPost } from '../../../types/post';
import ITag from '../../../types/tag';
import filterNews from './helpers';

import Chip from '../../../common/Chip';
import ErrorBlock from '../../../common/errorBlock';
import Loader from '../../../common/Loader';
import TagCloud from './TagCloud';
import NewsItem from './NewsItem';

import img from '../../../assets/img/icons/search.svg';

const Container = styled.div`
  position: relative;
  max-width: 1291px;
  display: flex;
  flex-direction: column;
  padding-left: 95px;
  padding-right: 95px;

  background: #ffffff;
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  margin-top: 275px;
  border-radius: 15px 15px 0px 0px;
`;

const MenuWrapper = styled.nav`
  min-height: 150px;
  padding: 108px 0 61px 0;
  display: flex;
  justify-content: space-between;

  font-style: normal;
  font-weight: normal;
  color: #515151;
  border-bottom: 1px solid #515151;
`;

const Menu = styled.div`
  display: flex;
`;

const MenuItem = styled.button`
  font-size: 16px;
  line-height: 20px;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  margin-right: 50px;
  padding: 0;
  padding-bottom: 7px;
  transition: 0.1s;
  &:hover {
    transform: scale(1.05);
    border-bottom: 3px solid #ffb11b;
  }
  &:active,
  &:focus {
    outline: none;
    border-bottom: 3px solid #ffb11b;
  }
`;

const ButtonSearch = styled.button`
  width: 35px;
  height: 35px;
  background-color: transparent;
  background: url(${img}) center no-repeat;
  border: 0;
  color: inherit;
  cursor: pointer;
  padding: 0;
  transition: 0.1s;
  &:hover {
    transform: scale(1.05);
  }
  &:focus {
    outline: none;
  }
`;

const SearchField = styled.input.attrs(() => ({
  type: 'search',
  placeholder: 'Поиск...',
}))`
  height: 46px;
  width: 100%;
  margin: 0 0 0 24px;
  padding: 13px 18px;
  background: #ffffff;
  border: none;
  border-bottom: 2px solid #515151;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #515151;
  &:focus {
    outline: none;
    border-bottom: 3px solid #ffb11b;
  }
`;

interface StateProps {
  data: null | IDataPost[];
  loading: boolean;
  error: null | Error;
  allTags: null | ITag[];
}

interface DispatchProps {
  getAllPosts: () => void;
  getPostsByTag: (tagName: string) => void;
  getAllTags: () => void;
  addBookmarkToPost: (postId: number) => void;
  removeBookmarkFromPost: (postId: number) => void;
  addLikeToPost: (postId: number) => void;
  removeLikeFromPost: (postId: number) => void;
  sharePost: (postId: number) => void;
}

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: RootState): StateProps => ({
  data: state.posts.data,
  loading: state.posts.loading,
  error: state.posts.error,
  allTags: state.posts.allTags,
});

const mapDispatchToProps = {
  getAllPosts: loadAllPosts,
  getPostsByTag: loadPostsByTag,
  getAllTags: loadAllTags,
  addBookmarkToPost: addBookmark,
  removeBookmarkFromPost: removeBookmark,
  addLikeToPost: addLike,
  removeLikeFromPost: removeLike,
  sharePost: addShare,
};

const News = ({
  data,
  loading,
  error,
  allTags,
  getAllPosts,
  getPostsByTag,
  getAllTags,
  addBookmarkToPost,
  removeBookmarkFromPost,
  addLikeToPost,
  removeLikeFromPost,
  sharePost,
}: Props) => {
  const searchField = useRef<HTMLInputElement>(null);
  const [showSearchField, setShowSearchField] = useState(false);
  const [actualFilter, setActualFilter] = useState<string>('all');
  const [searchRequest, setSearchRequest] = useState<string | null>(null);

  useEffect(() => {
    if (actualFilter === 'tags') getAllTags();
    if (actualFilter !== 'tags' && actualFilter !== 'postByTag') getAllPosts();
  }, [actualFilter, getAllPosts, getAllTags]);

  useEffect(() => {
    if (showSearchField) searchField?.current?.focus();
  }, [showSearchField]);

  const setNewsFilter = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setActualFilter(event.currentTarget.name);
  };

  const submitNewsRequest = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      setActualFilter('request');
      setSearchRequest(event.currentTarget.value);
      event.currentTarget.value = '';
    }
  };

  const renderSearchField = (): JSX.Element => {
    if (showSearchField) {
      return (
        <SearchField
          ref={searchField}
          onBlur={(): void => setShowSearchField(false)}
          onKeyPress={submitNewsRequest}
        />
      );
    }
    return (
      <ButtonSearch
        onClick={(): void => {
          setShowSearchField((prev) => !prev);
        }}
      />
    );
  };

  const showPostByTag = (tag: string): void => {
    setActualFilter('postByTag');
    getPostsByTag(tag);
  };

  const renderContent = (): JSX.Element | JSX.Element[] => {
    if (loading) return <Loader />;
    if (error) return <ErrorBlock errorMessage="Error occured with loading posts." />;

    if (actualFilter === 'tags') return <TagCloud tags={allTags} getPostsByTag={showPostByTag} />;

    if (!data) return <h1>Ничего не найдено!</h1>;
    const filteredNews = filterNews([...data], actualFilter, searchRequest);
    if (filteredNews.length === 0) return <h1>Ничего не найдено!</h1>;

    return filteredNews.map((postData) => (
      <NewsItem
        key={postData.post.id}
        postData={postData}
        getPostsByTag={showPostByTag}
        addBookmarkToPost={addBookmarkToPost}
        removeBookmarkFromPost={removeBookmarkFromPost}
        addLikeToPost={addLikeToPost}
        removeLikeFromPost={removeLikeFromPost}
        sharePost={sharePost}
      />
    ));
  }; /* B filterNews УБРАТЬ СПЛАЙС ПОСЛЕ НАСТРОЙКИ СЕРВЕРНОЙ ПАГИНАЦИИ */

  return (
    <Container>
      <Chip>Новости</Chip>
      <MenuWrapper>
        <Menu>
          <MenuItem name="all" onClick={setNewsFilter}>
            Все
          </MenuItem>
          <MenuItem name="new" onClick={setNewsFilter}>
            По дате
          </MenuItem>
          <MenuItem name="popular" onClick={setNewsFilter}>
            По популярности
          </MenuItem>
          <MenuItem name="tags" onClick={setNewsFilter}>
            По тегам
          </MenuItem>
        </Menu>
        {renderSearchField()}
      </MenuWrapper>

      {renderContent()}
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
