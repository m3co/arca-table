
import * as React from 'react';
import { mount } from 'enzyme';

import Socket from 'socket.io-client';
import { ARCASocket, reducer, FACADReports } from 'arca-redux';
import { createStore } from 'redux';

import { TBody } from './TBody';

const URL = 'http://localhost:8086';
const Source = 'FACAD-Reports';

test('TBody renders FACAD-Reports', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  socket.GetInfo(Source);
  socket.Select(Source);
  store.subscribe((): void => {
    const state = store.getState();
    const { Rows, Info } = state.Source[Source];
    if (state.Connected &&
      Info &&
      Rows.length > 0) {

      const el = (
        <table>
          <TBody
            Rows={Rows}
            Info={Info} />
        </table>
      );
      const wrapper = mount(el);
      expect(wrapper).toMatchSnapshot();
      done();
    }
  });
});

test('TBody adds a new row FACAD-Reports', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  const newRow: FACADReports["Row"] = {
    ID: 0,
    BuiltInCategory: 'INVALID',
    ReportType: 'Schedule',
    Name: 'A name',
    PathName: 'Path Name',
    Field1: '',
    Field2: '',
    Field3: '',
  };

  socket.GetInfo(Source);
  socket.Select(Source);
  store.subscribe((): void => {
    const state = store.getState();
    const { Rows, Info } = state.Source[Source];
    if (state.Connected &&
      Info &&
      Rows.length > 0) {

      const el = (
        <table>
          <TBody
            Rows={Rows}
            newRow={newRow}
            Info={Info} />
        </table>
      );
      const wrapper = mount(el);
      expect(wrapper).toMatchSnapshot();
      done();
    }
  });
});
