import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from './ssdcoinLazyBaseQuery';

export { baseQuery };

export default createApi({
  reducerPath: 'ssdcoinApi',
  baseQuery,
  endpoints: () => ({}),
});
