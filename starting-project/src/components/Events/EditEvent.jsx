import { Link, redirect, useNavigate, useNavigation, useParams, useSubmit } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';

export default function EditEvent() {

  const { id } = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const {state} = useNavigation();

  const { data, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
    staleTime: 1000 * 10,//staleTime é o tempo que a query pode ficar sem ser atualizada, se passar desse tempo, a query é considerada como stale e é atualizada
  })

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {//O objetivo disso é mudar a UI antes que o resultado seja feito pelo backend, isso se chama optimistic update
  //     const updatedEvent = data.event;
  //     await queryClient.cancelQueries({ queryKey: ['events', id] });//Cancela a query de eventos, para que ela seja refeita, assim atualizando a lista de eventos

  //     const previousEvent = queryClient.getQueryData(['events', id]);//Pega os dados do evento antes de ser atualizado
  //     queryClient.setQueryData(['events', id], updatedEvent);//setQueryData serve para atualizar os dados de uma query, no caso, ele atualiza os dados do evento que foi atualizado

  //     return { previousEvent };//Retorna o evento anterior para que possamos usar ele no onError, mais especificamente no setQueryData para voltar a como era antes
  //   },
  //   onError: (error, data, context) => {//onError é chamado quando a requisição falha
  //     queryClient.setQueryData(['events', id], context.previousEvent);//Se der erro, ele volta para o estado anterior. Context é o que foi retornado no onMutate
  //   },
  //   onSettled: () => {//onSettled é chamado quando a requisição é completada, seja com sucesso ou falha
  //     queryClient.invalidateQueries(['events', id]);//Invalida a query de eventos, para que ela seja refeita, assim atualizando a lista de eventos, just to make sure
  //   }
  // });

  function handleSubmit(formData) {
    // mutate({ id, event: formData });//onMutate vai ativar primeiro, antes mesmo da resposta do backend
    // navigate('../');
    submit(formData, {method: 'PUT'});//O useSubmit é uma função que serve para fazer requisições, ele é uma alternativa ao mutate, ele é mais simples e não tem as opções de onMutate, onError e onSettled, mas ele é mais simples e serve para requisições mais simples
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isError) {
    content =
      <>
        <ErrorBlock title='Failed to load event.' message={error.info?.message || 'Please try again later.'} />
        <div>
          <Link to="../" className="button">Okay</Link>
        </div>
      </>;
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">{/* ../ é para voltar pra url anterior */}
          Cancel
        </Link>
        <button type="submit" className="button">
          {state === 'submitting' ? "Updating..." : "Update"}
        </button>
      </EventForm>
    );
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

export function loader({params}){//Just another way to fetch the data, it's the same as the useQuery
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }),
  });
}

export async function action({request, params}) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(['events']);
  return redirect('../')
}
