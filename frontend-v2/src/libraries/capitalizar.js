/**
 * 
 * @param {string} string 
 */
export default function capitalizar(string) {
  return String(string).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
};