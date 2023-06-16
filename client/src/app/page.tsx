
import getQueryClient from '@/utils/getQueryClient';
import Login from './login'
import { dehydrate } from '@tanstack/react-query';
import Hydrate from '@/utils/hydrate.client';



export default function Home() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient)
  return (
    <Hydrate state={dehydratedState}>
      <Login />
    </Hydrate>
  )
}
