export default function handleApiError(error, router) {
  if (!error.response) {
    console.error('Network error:', error);
    router.push({ name: 'server-error' });
    return;
  }

  const status = error.response.status;

  switch (status) {
    case 404:
      console.warn('Resource not found:', error);
      router.push({ name: 'not-found' });
      break;

    case 500:
      console.error('Server error:', error);
      router.push({ name: 'server-error' });
      break;

    default:
      console.error('Unexpected error:', error);
      break;
  }
}
