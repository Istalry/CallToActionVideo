import { Layout } from './components/Layout';
import { Controls } from './features/editor/Controls';
import { CanvasPreview } from './features/editor/CanvasPreview';

function App() {
  return (
    <Layout>
      <Controls />
      <CanvasPreview />
    </Layout>
  );
}

export default App;
