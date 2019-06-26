import React from 'react';
import { AppStateWrapper } from './components/AppStateWrapper'
import './App.css'
import { Card } from 'antd';
import { RangeSelector } from './components/RangeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { Statistics } from './components/Statistics';
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
          <Card bordered={false}>
            <Statistics />
          </Card>
          <Card bordered={false}>
            <Chart />
          </Card>
        </React.Fragment>
      </AppStateWrapper>
    </div>
  );
}

export default App;
