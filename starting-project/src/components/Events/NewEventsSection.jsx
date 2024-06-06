import { useQuery } from '@tanstack/react-query'

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  const {data, isPending: isLoading, isError, error} = useQuery({//useQuery is a hook provided by React Query that we can use to fetch data, those properties are provided by the hook to help us manage the state of the query
    queryKey: ['events', {max: 3}],//This is the key that React Query uses to cache the data
    queryFn: ({signal, queryKey}) => fetchEvents({signal, ...queryKey[1]}), //Quando saímos do estado de loading, o React Query chama a função fetchEvents para buscar os dados, mas se os dados já estiverem em cache, ele chama a função por baixo dos panos para saber se atualizou, mas antes disso põe oq ta no cache
    staleTime: 5000, //This property tells React Query to consider the data stale after 5 seconds, which means that it will refetch the data after that time
    // gcTime: 60000, //This property tells React Query to garbage collect the data (throw away) after 60 seconds
  });

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'Failed to fetch events.'} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
