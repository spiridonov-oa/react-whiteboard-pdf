import React from 'react';
import { Whiteboard } from './lib/index.js';
import styles from './app.module.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard />
      </main>
    </div>
  );
};

export default App;
