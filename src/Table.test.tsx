
import * as React from 'react';
import { mount } from 'enzyme';

import Socket from 'socket.io-client';
import { ARCASocket, reducer, FACADReports } from 'arca-redux';
import { createStore } from 'redux';

import { Table } from './Table';

const URL = 'http://localhost:8086';
const Source = 'FACAD-Reports';

test('Table renders "No Info"', (): void => {
  const el = (<Table Rows={[]}/>);
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
});

test('Table renders FACAD-Reports', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  socket.GetInfo(Source);
  socket.Select(Source);
  store.subscribe((): void => {
    const state = store.getState();
    if (state.Connected &&
            state.Source[Source].Info &&
            state.Source[Source].Rows.length > 0) {

      const el = (<Table
        Rows={state.Source[Source].Rows}
        Info={state.Source[Source].Info}/>);
      const wrapper = mount(el);
      expect(wrapper).toMatchSnapshot();
      done();
    }
  });
});

test('Table FACAD-Reports redacts one entry', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  socket.GetInfo(Source);
  socket.Select(Source);
  store.subscribe((): void => {
    const state = store.getState();
    if (state.Connected &&
            state.Source[Source].Info &&
            state.Source[Source].Rows.length > 0) {

      let onUpdateReached = false;
      const onUpdate = (): void => {
        onUpdateReached = true;
      }

      const el = (<Table
        onUpdate={onUpdate}
        Rows={state.Source[Source].Rows}
        Info={state.Source[Source].Info}/>);
      const wrapper = mount(el);
      wrapper.find('tr').at(1).find('td').at(2).simulate('click');
      expect(wrapper).toMatchSnapshot();
      wrapper.find('input').simulate('change', { target: { value: 'new value' }});
      expect(wrapper).toMatchSnapshot();
      wrapper.find('input').simulate('keyup', { key: 'Enter' });
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('tr').at(1).find('td').at(2).text()).toBe('new value');
      expect(onUpdateReached).toBe(true);
      done();
    }
  });
});

test('Table FACAD-Reports renders a new Row', (done): void => {
  const io = Socket(URL);
  const store = createStore(reducer);
  const socket = new ARCASocket(store, io);

  const provideNewRow = (): FACADReports["Row"] => {
    const newRow: FACADReports["Row"] = {
      ID: 0,
      BuiltInCategory: 'INVALID',
      ReportType: 'Schedule',
      Name: 'A name',
      PathName: 'Path Name',
      Field1: '',
      Field2: '',
      Field3: '',
    }
    return newRow;
  };

  let onInsertReached = false;
  const onInsert = (): string => {
    onInsertReached = true;
    return 'uuid4';
  }

  socket.GetInfo(Source);
  socket.Select(Source);
  store.subscribe((): void => {
    const state = store.getState();
    if (state.Connected &&
            state.Source[Source].Info &&
            state.Source[Source].Rows.length > 0) {

      const el = (<Table
        provideEmptyRow={provideNewRow}
        Rows={state.Source[Source].Rows}
        onInsert={onInsert}
        Info={state.Source[Source].Info}/>);
      const wrapper = mount(el);
      expect(wrapper).toMatchSnapshot();

      wrapper.find('caption button').simulate('click');
      expect(wrapper).toMatchSnapshot();

      wrapper.find('tr').at(1).find('td').at(2).simulate('click');
      wrapper.find('input').simulate('change', { target: { value: 'new value' }});
      wrapper.find('input').simulate('keyup', { key: 'Enter' });
      expect(wrapper).toMatchSnapshot();

      expect(onInsertReached).toBe(true);
      done();
    }
  });
});
