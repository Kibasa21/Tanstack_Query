import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {

  const { id } = useParams();//useParams serve para pegar os parametros da URL, no caso, o id do evento
  const navigate = useNavigate();//useNavigate serve para navegar entre as rotas
  const [isDeleted, setIsDeleted] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ['events', id ],//O queryKey é um array que contém a chave da query e um objeto com os parâmetros da query, no caso, o id do evento
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate: onDelete, isPending: isDeleting, isError: failedDeletion, error} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none' //This property tells React Query to not refetch the data, but to invalidate the cache instead
      });
      navigate('/events');
    }
  });

  const formattedDate = new Date(data?.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function handleStartDelete() {
    setIsDeleted(true);
  }

  function handleStopDelete() {
    setIsDeleted(false);
  }

  function handleDelete() {
    onDelete({ id });
  }

  return (
    <>
      {
        isDeleted &&
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event? This action cannot be undone.</p>
          <div className="form-actions">
            <button onClick={handleStopDelete} className='button-text'>Cancel</button>
            <button onClick={handleDelete} className='button'>{isDeleting ? 'Deleting...' : 'Delete'}</button>
          </div>
          {failedDeletion && <ErrorBlock title="Failed to delete event." message={error.info?.message || "Please try again later."} />}
        </Modal>
      }
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <div id='event-details-content' className='center'><LoadingIndicator /></div>}
      {isError && <div id='event-details-content' className='center'><ErrorBlock title="Failed to load event." message="Please try again later." /></div>}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleStartDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{`${formattedDate} at ${data.time}`}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
