import { useRoutes } from 'react-router-dom';
import routes from './config';

const AppRoutes: React.FC = () => {
  return useRoutes(routes);
};

export { AppRoutes };
