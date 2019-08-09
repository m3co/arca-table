
import * as React from 'react';
import { mount } from 'enzyme';

import Socket from 'socket.io-client';
import { ARCASocket, reducer, FACADSchedules } from 'arca-redux';
import { createStore } from 'redux';

import { TBody } from './TBody';

const URL = 'http://localhost:8086';
const Source = 'FACAD-Schedules';

test('TBody renders FACAD-Schedules', (done): void => {
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

test('TBody adds a new row FACAD-Schedules', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  const newRow: FACADSchedules["Row"] = {
    ID: 0,
    BuiltInCategory: 'INVALID',
    Name: 'A name',
    PathName: 'Path Name'
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
