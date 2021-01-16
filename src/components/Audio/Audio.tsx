import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { debounce } from 'lodash';
import album from '../../assets/img/album5.png';
import pic from '../../assets/img/pic.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TypeDispatch } from '../../redux-toolkit/store';
import { TypeRootReducer } from '../../redux-toolkit/rootReducer';
import {
  allAudiosAction,
  friendAudiosAction,
  friendsAudioAction,
  myAudiosAction,
  myPlaylistsAction,
  openPlayListAction,
  searchSongsAction,
} from '../../redux-toolkit/audios/allAudiosSlice';
import fetchStates from '../../constants/fetchState';
import IAudios from '../../types/audios';
import IfriendData from '../../types/friendData';
import { AddPlayList, LeftSide, Main, RightSide } from './Audio.styles';
import FilterTabs from './FilterTabs';
import { Tabs } from './FilterTabs/FilterTabs';
import HeadSlider from './HeadSlider';
import Search from './Search';
import PlaylistSlider from './PlaylistSlider';
import Songs from './Songs/Songs';

const { pending, rejected } = fetchStates;

const Audio: React.FC = () => {
  const dispatch: TypeDispatch = useDispatch();
  const objAudiosState = useSelector(({ allAudiosReducer }: TypeRootReducer) => allAudiosReducer);
  const loaded = objAudiosState.loading.endsWith(pending);
  const playlistsData: Array<Record<string, any>> = objAudiosState.myPlaylists;
  const [dragging, setDragging] = useState(false); // предотвращает регистрацию кликов при скролле

  useEffect(() => {
    setDragging(false);
    if (objAudiosState.loading.endsWith(rejected)) {
      message.error(objAudiosState.msgFetchState);
    }
  }, [objAudiosState, objAudiosState.loading, objAudiosState.msgFetchState]);

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.My);

  useEffect(() => {
    dispatch(myAudiosAction());
    dispatch(myPlaylistsAction());
  }, [dispatch]);

  const timeAudio = (sec: number): string | number => {
    if (sec === null) {
      return sec;
    }
    let minutes: number | string = Math.floor(sec / 60);
    let seconds: number | string = sec % 60;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  const openTab = (tab: Tabs) => {
    setActiveTab(tab);

    switch (tab) {
      case Tabs.My:
        return dispatch(myAudiosAction());
      case Tabs.All:
        return dispatch(allAudiosAction());
      case Tabs.Friends:
        return dispatch(friendsAudioAction());
      default:
        return null;
    }
  };

  const AllAudios =
    objAudiosState &&
    objAudiosState.allAudios.length > 0 &&
    objAudiosState.allAudios.map(({ icon, author, name, id, length }: IAudios) => (
      <li key={id}>
        <LeftSide>
          <div>
            <img src={pic || `https://${icon}`} alt="icon" title="icon" />
          </div>
          <div>
            <h3>{author}</h3>
            <p>{name}</p>
          </div>
        </LeftSide>
        <RightSide>
          <h4>{timeAudio(length)}</h4>
        </RightSide>
      </li>
    ));

  const Friends =
    objAudiosState &&
    objAudiosState.friends.length > 0 &&
    objAudiosState.friends.map(({ firstName, lastName, id, avatar }: IfriendData) => (
      <button
        key={id}
        type="button"
        onClick={() => {
          if (!dragging) dispatch(friendAudiosAction(id));
        }}
      >
        <img src={pic || avatar} alt="" />
        <p>{firstName}</p>
        <p>{lastName}</p>
      </button>
    ));

  const MyAudios =
    objAudiosState &&
    objAudiosState.myAudios.length > 0 &&
    objAudiosState.myAudios.map(({ icon, author, name, id, length }: IAudios) => (
      <li key={id}>
        <LeftSide>
          <div>
            <img src={pic || `https://${icon}`} alt="icon" title="icon" />
          </div>
          <div>
            <h3>{author}</h3>
            <p>{name}</p>
          </div>
        </LeftSide>
        <RightSide>
          <h4>{timeAudio(length)}</h4>
        </RightSide>
      </li>
    ));

  const PlayList =
    objAudiosState &&
    objAudiosState.currentSearch.length > 0 &&
    objAudiosState.currentSearch.map(({ icon, author, name, id, length }: IAudios) => (
      <li key={id}>
        <LeftSide>
          <div>
            <img src={pic || `https://${icon}`} alt="icon" title="icon" />
          </div>
          <div>
            <h3>{author}</h3>
            <p>{name}</p>
          </div>
        </LeftSide>
        <RightSide>
          <h4>{timeAudio(length)}</h4>
        </RightSide>
      </li>
    ));

  const playlists = playlistsData.map((list) => (
    <button
      key={list.id}
      type="button"
      onClick={(): void => {
        if (!dragging) dispatch(openPlayListAction(list.id));
      }}
    >
      <img src={album || list.image} alt="" />
      <p>{list.name}</p>
    </button>
  ));
  playlists.push(
    <AddPlayList>
      <p>Добавить плейлист</p>
    </AddPlayList>
  );

  const audiosList =
    (objAudiosState.currentSearch.length > 0 && PlayList) ||
    (activeTab === Tabs.Friends && PlayList) ||
    (activeTab === Tabs.All && AllAudios) ||
    (activeTab === Tabs.My && MyAudios) ||
    (loaded && 'Аудиозаписи не найдены');

  const startSearch = debounce((name) => {
    if (name) dispatch(searchSongsAction(name));
  }, 1000);

  const searchSongs = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    startSearch(value);
  };

  let playlistSliderItems;
  let playlistSliderTitle;

  if (activeTab === Tabs.My) {
    playlistSliderItems = playlists;
    playlistSliderTitle = 'Плейлисты';
  }
  if (activeTab === Tabs.Friends) {
    playlistSliderItems = Friends;
    playlistSliderTitle = 'Выберите друга';
  }

  return (
    <Main>
      <HeadSlider />
      <FilterTabs openTab={openTab} activeTab={activeTab} />
      <Search searchSongs={searchSongs} />
      {playlistSliderItems && (
        <PlaylistSlider items={playlistSliderItems} title={playlistSliderTitle} />
      )}
      <Songs items={audiosList} />
    </Main>
  );
};

export default Audio;