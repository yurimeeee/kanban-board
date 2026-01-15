import { Button } from '@components/ui/button';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  min-height: 100vh;
`;

function App() {
  return (
    <Wrapper className="flex items-center justify-center">
      <Button>Template Ready</Button>
    </Wrapper>
  );
}

export default App;
