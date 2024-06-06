export async function fetchEvents({signal, searchTerm}) {
  let url = 'http://localhost:3000/events';

  if(searchTerm){
    url += '?search=' + searchTerm;//If the searchTerm is provided, we append it to the URL, the ?search= in the url means that we are passing a query parameter to the server
  }

  const response = await fetch(url, {signal: signal});//O signal serve para cancelar a requisição, se a requisição for cancelada, o fetch lança uma exceção

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`http://localhost:3000/events/images`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}