import './App.css';
import KanbanBoard from './components/KanbanBoard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>TaskFlow</h1>
      <KanbanBoard />
    </QueryClientProvider>
  )
}

export default App
