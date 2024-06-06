import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({//Serve para fazer uma mutação, ou seja, uma requisição que altera o estado do servidor, como criar, atualizar ou deletar um recurso. No backend ele faz um POST, PUT ou DELETE
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    mutate({ event: formData });//Mutate serve para ativar a função posta em useMutation, diferente do useQuery, ele não é ativado toda vez que a pagina renderiza, apenas quando chamamos a função mutate
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {
          !isPending && (
            <>
              <Link to="../" className="button-text">
                Cancel
              </Link>
              <button type="submit" className="button">
                Create
              </button>
            </>
          )
        }
      </EventForm>
      {isError && <ErrorBlock title='Failed to create event.' message={error.info?.message || 'Failed to create event. Please check your inputs and try again later.'} />}
    </Modal>
  );
}
