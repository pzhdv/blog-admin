import { redirect } from 'react-router-dom';

const BlogAuthor = () => {
  return null;
};

export const loader = () => {
  return redirect('author-info');
};

export default BlogAuthor;
