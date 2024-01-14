export default function parseUrl(url) {
  // Converting the current url to an array based on '/'
  let urlToArray = url?.split('/');

  // Removing empty elements from the array
  // urlToArray = urlToArray.filter(Boolean);
  // Adding a check to ensure urlToArray is defined before using filter
  urlToArray = urlToArray ? urlToArray.filter(Boolean) : [];

  // Setting the default language to be empty or 'en' if needed
  //let defaultLang = '';

  // Extracting the slug directly from the url
  let slug = urlToArray?.join('/') || undefined;

  // Returning the slug
  return { slug };
}
