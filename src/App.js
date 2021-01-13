import './App.css';
import styled from 'styled-components'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from './components/Menu';
import Azuki from './components/Token/Azuki';
import Doki from './components/Token/Doki';
import Degacha from './components/Degacha';
import MachineDetails from './components/Degacha/components/MachineDetails'
import About from './components/About';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0,0,0,0) linear-gradient(193.68deg, #acfffb 0%, #ebb6fa 50%) repeat scroll 0% 0%;
  color: #4d4065;
  padding-top: 30px;
`;

const ContentContainer = styled.div`
  display: grid;
  -moz-box-pack: start;
  justify-content: start;
  -moz-box-align: start;
  align-items: start;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 96%;
  margin: 0px 2%;
`;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Menu />
        <Main>
          <ContentContainer>
            <div>
              <Switch>
                <Route path="/token/doki" children={<Doki />} />
                <Route path="/product/degacha/machine/:id" children={<MachineDetails />} />
                <Route path="/product/degacha" children={<Degacha />} />
                <Route path="/about" children={<About />} />
                <Route path="/" children={<Azuki />} />
              </Switch>
            </div>
          </ContentContainer>
        </Main>
      </BrowserRouter>
    </div>
  );
}

export default App;
