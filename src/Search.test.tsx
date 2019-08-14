
import * as React from 'react';
import { mount } from 'enzyme';
import Socket from 'socket.io-client';

import { Search } from './Search';
import { Combobox, createSearchSocket,
  State, Fields, Params,
  FACADBuiltInCategories } from 'arca-redux';

interface Response {
  ID: string;
  Method: "Search";
  Context: {
    Field: keyof Fields;
    Source: keyof State["Source"];
  };
  Result: Params[];
  Error: {} | null;
};

const URL = 'http://localhost:8086';

interface mockFns {
  onBlur?: (currentValue: string) => void;
  onEnter?: (currentValue: string) => void;
  onEsc?: () => void;
}

function prepareMock2(searchMock: (Source: keyof State["Source"],
Field: keyof Fields,
Params: Params) => Promise<Response>, fns?: mockFns) {

  const combobox: Combobox = {
    Source: "FACAD-BuiltInCategories",
    Display: "BuiltInCategory",
    Value: "BuiltInCategory",
    Params: {
      BuiltInCategory: "BuiltInCategory"
    }
  };
  const row: FACADBuiltInCategories = {
    Row: {
      BuiltInCategory: 'INVALID',
    },
    PK: {
      BuiltInCategory: 'INVALID',
    }
  };

  return (<Search
    list={'475e016e-6423-4462-bd91-0535a7e384fc'}
    search={searchMock}
    Row={row.Row}
    Setup={combobox}
    value={'INVALID'}
    onBlur={fns ? fns.onBlur : undefined}
    onEnter={fns ? fns.onEnter : undefined}
    onEsc={fns ? fns.onEsc : undefined} />)
}

test('Search normally renders', (done): void => {
  const io = Socket(URL);
  const search = createSearchSocket(io);
  const searchMock = (Source: keyof State["Source"],
    Field: keyof Fields,
    Params: Params): Promise<Response> => {
    const r = search(Source, Field, Params, '5832c751-a6a9-4cd2-9235-157d90cb95d3');
    r.then((response: Response): void => {
      setTimeout(() => {
        wrapper.update();
        expect(response).toMatchSnapshot();
        expect(wrapper).toMatchSnapshot();
        done();
      });
    });
    return r;
  };

  const el = prepareMock2(searchMock);
  const wrapper = mount(el);
});
const searchMock = (Source: keyof State["Source"],
Field: keyof Fields,
Params: Params): Promise<Response> => {
  const response: Response = {
    ID: '',
    Method: "Search",
    Context: {
      Field,
      Source,
    },
    Result: [{BuiltInCategory:"OST_InternalLineLoads"},{BuiltInCategory:"OST_InternalLineLoadTags"},{BuiltInCategory:"OST_LineLoads"},{BuiltInCategory:"OST_LineLoadTags"}],
    Error: null,
  };
  return Promise.resolve(response);
};

test('Search changes its value', (): void => {
  const el = prepareMock2(searchMock);
  const wrapper = mount(el);
  wrapper.update();
  wrapper.find('input').simulate('change', { target: { value: 'ANOTHER' } });
  expect(wrapper).toMatchSnapshot();
});

test('Search fires onBlur', (): void => {
  let onBlurReached = false;
  const onBlur = (currentValue: string): void => {
    expect(currentValue).toBe('INVALID');
    onBlurReached = true;
  }

  const el = prepareMock2(searchMock, {onBlur});
  const wrapper = mount(el);
  wrapper.find('input').simulate('blur');
  expect(onBlurReached).toBe(true);
});

test('Search ignores onEnter if altKey', (): void => {
  const value = 'INVALID';
  const onEnter = (currentValue: string): void => {
    expect(currentValue).toBe(value);
    fail();
  }
  const el = prepareMock2(searchMock, {onEnter});
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Enter', altKey: true });
});

test('Search accepts onEnter', (): void => {
  const value = 'INVALID';
  const onEnter = (currentValue: string): void => {
    expect(currentValue).toBe(value);
  }
  const el = prepareMock2(searchMock, {onEnter});
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Enter' });
});

test('Input fires onEsc', (): void => {
  let onEscReached = false;
  const onEsc = (): void => {
    onEscReached = true;
  }
  const el = prepareMock2(searchMock, {onEsc});
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Escape' });
  expect(onEscReached).toBe(true);
});
