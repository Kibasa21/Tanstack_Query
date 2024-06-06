import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();//Estamos usando esse useState para armazenar o valor do input de pesquisa, 

  const {data, isLoading, isError, error} = useQuery({//isLoading serve para saber se a query está em andamento, isError serve para saber se ocorreu um erro, error serve para armazenar o erro e ele difere do isPending, pois o isPending é true enquanto a query está em andamento, mas o isError é true se ocorrer um erro
    queryKey: ['events', {search: searchTerm}],//We pass the search term as a query parameter to the fetchEvents function, so we can use it to filter the events, and we're putting it in an object to make it easier to pass multiple query parameters
    queryFn: ({signal}) => fetchEvents({signal, searchTerm}),
    enabled: searchTerm !== undefined,//We're using the enabled property to prevent the query from running when the search term is undefined, which is the initial state of the search term. Enable serve para habilitar ou desabilitar a query, se o searchTerm for undefined, a query não é executada
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);//We're managing state cause we want to update the search term when the form is submitted
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'Failed to fetch events.'} /> //the ? stands for optional chaining, it checks if the info property exists before trying to access the message property
    );
  }

  if(data) {
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
