import React from 'react';
import { AppStateWrapper, AppContext } from './components/AppStateWrapper'
import './App.css'
import { Card } from 'antd';
import { RangeSelector } from './components/RangeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { Statistics } from './components/Statistics';
import { SingleDay } from './components/SingleDay'
import Chart from './components/Chart';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppStateWrapper>
        <React.Fragment>
          <Card bordered={false}>
            <RangeSelector />
            <LanguageSelector />
          </Card>
          <AppContext.Consumer>
            {value => {
              const { range } = value
              return (
                range.length === 1 ?
                  <Card bordered={false}>
                    <SingleDay />
                  </Card>
                  :
                  <React.Fragment>
                    <Card bordered={false}>
                      <Statistics />
                    </Card>
                    <Card bordered={false}>
                      <Chart />
                    </Card>
                  </React.Fragment>
              )
            }}
          </AppContext.Consumer>
        </React.Fragment>
      </AppStateWrapper>
    </div>
  );
}

export default App;
