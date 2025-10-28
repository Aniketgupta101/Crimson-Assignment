import DataDisplay from '../components/features/DataDisplay';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <main>
          <DataDisplay />
        </main>
      </div>
    </ErrorBoundary>
  );
}
