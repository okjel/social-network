/* eslint-disable max-len */
import { createAsyncThunk, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchAudiosAll, fetchMyPartAudios, fetchMyPlaylists, fetchMyFriends, fetchSearchedSongs, fetchPlaylist } from '../../services/audios-controller/audio-controller';
import IfriendData from '../../typesInterfaces/IfriendData';
import errFetchHandler from '../../helperFunctions/errFetchHandler';
import { TypeRootReducer } from '../rootReducer';

// Типа action, который потом диспатчится

export const searchSongsAction = createAsyncThunk('audios/searchSongsAction', async (name: string) =>
  fetchSearchedSongs(name));

export const openPlayListAction = createAsyncThunk('audios/openPlayListAction', async (id: number) =>
  fetchPlaylist(id));

export const allAudiosAction = createAsyncThunk(
  'audios/allAudiosAction',
  async (data, argThunkAPI) => {
    try {
      const response = await fetchAudiosAll();
      return response.data;
    } catch (err) {
      return errFetchHandler(err.response.data, argThunkAPI);
    }
  },
);

export const myAudiosAction = createAsyncThunk(
  'fetch/myAudiosAction',
  async (data, argThunkAPI) => {
    try {
      const response: any = await fetchMyPartAudios();
      return response.data;
    } catch (err) {
      return errFetchHandler(err.response.data, argThunkAPI);
    }
  },
);

export const friendsAudioAction = createAsyncThunk(
  'fetch/friendsAudioAction',
  async (data, argThunkAPI) => {
    try {
      // Тестовый url
      const arrFriendsIds = await fetchMyFriends();
      const arrPromiseFriendsData: Array<Promise<IfriendData>> = arrFriendsIds.data
        .map(async ({ friendId }: { friendId: number }) => {
          try {
            const friendData = await axios.get(`http://91.241.64.178:5561/api/v2/users/${friendId}`);
            return friendData.data;
          } catch (e) {
            return e.response.data;
          }
        });
      const arrFriendsData: Array<IfriendData> = await Promise.all(arrPromiseFriendsData);
      return arrFriendsData;
    } catch (err) {
      return errFetchHandler(err.response.data, argThunkAPI);
    }
  },
);

export const myPlaylistsAction = createAsyncThunk(
  'audios/myPlaylistsAction',
  async (data, argThunkAPI) => {
    try {
      const response = await fetchMyPlaylists();
      return response.data;
    } catch (err) {
      return errFetchHandler(err.response.data, argThunkAPI);
    }
  },
);

const allAudiosSlice = createSlice({
  name: 'allAudiosSlice',
  initialState: { myAudios: [], allAudios: [], friends: [], myPlaylists: [], currentSearch: [], loading: '', msgFetchState: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(allAudiosAction.pending,
      (state, action: PayloadAction<any>) => {
        console.log(state, action, 'plug');
      });
    builder.addCase(allAudiosAction.fulfilled,
      (state: Draft<any>, action: PayloadAction<any>) => {
        state.friends = [];
        state.allAudios = action.payload;
        state.loading = action.type;
      });
    builder.addCase(allAudiosAction.rejected,
      (state: Draft<any>, action) => {
        state.friends = [];
        state.loading = action.type;
        state.msgFetchState = action.error.message;
      });
    builder.addCase(myAudiosAction.pending, (state: Draft<any>, action: PayloadAction<any>) => {
      state.loading = action.type;
      state.msgFetchState = action.payload;
    });
    builder.addCase(myAudiosAction.fulfilled, (state: Draft<any>, action: PayloadAction<any>) => {
      state.allAudios = [];
      state.friends = [];
      state.myAudios = action.payload;
    });
    builder.addCase(myAudiosAction.rejected, (state: Draft<any>, action) => {
      state.allAudios = [];
      state.friends = [];
      state.loading = action.type;
      state.msgFetchState = action.error.message;
    });
    builder.addCase(friendsAudioAction.pending, (state, action) => {
      console.log(state, action, 'plug');
    });
    builder.addCase(friendsAudioAction.fulfilled,
      (state: Draft<any>, action: PayloadAction<any>) => {
        state.allAudios = [];
        state.friends = action.payload;
      });
    builder.addCase(friendsAudioAction.rejected,
      (state: Draft<any>, action) => {
        state.allAudios = [];
        state.loading = action.type;
        state.msgFetchState = action.error.message;
      });
    builder.addCase(myPlaylistsAction.pending, (state: Draft<any>, action: PayloadAction<any>) => {
      state.loading = action.type;
      state.msgFetchState = action.payload;
    });
    builder.addCase(myPlaylistsAction.fulfilled, (state: Draft<any>, action: PayloadAction<any>) => {
      state.myPlaylists = action.payload;
    });
    builder.addCase(myPlaylistsAction.rejected, (state: Draft<any>, action) => {
      state.loading = action.type;
      state.msgFetchState = action.error.message;
    });
  },
});

// Можно в useSelector подставлять просто эту константу
export const allAudiosSliceSelector = (state: TypeRootReducer) =>
  state.allAudiosReducer;
// Можно в useSelector подставлять просто эту константу END

const allAudiosReducer = allAudiosSlice.reducer;
export default allAudiosReducer;
