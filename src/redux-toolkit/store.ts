import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    store.replaceReducer(rootReducer);
  });
}

export type TypeDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
