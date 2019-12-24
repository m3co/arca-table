
import * as React from 'react';
import { mount } from 'enzyme';

import { TCell } from './TCell';
import { State, Params, FACADReports, Field, Fields, Row } from 'arca-redux';

interface Response {
  ID: string;
  Method: 'Search';
  Context: {
    Field: keyof Fields;
    Source: keyof State['Source'];
  };
  Result: Params[];
  Error: {} | null;
};

const searchMock = (Source: keyof State['Source'],
  Field: keyof Fields,
  Params: Params): Promise<Response> => {
  const response: Response = {
    ID: '',
    Method: 'Search',
    Context: {
      Field,
      Source,
    },
    Result: [
      {BuiltInCategory: 'OST_InternalLineLoads'},
      {BuiltInCategory: 'OST_InternalLineLoadTags'},
      {BuiltInCategory: 'OST_LineLoads'},
      {BuiltInCategory: 'OST_LineLoadTags'},
    ],
    Error: null,
  };
  return Promise.resolve(response);
};

interface MockHanders {
  onEdit?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  search?: typeof searchMock;
  isNew?: boolean;
};

function prepareMock1(overloadField?: Field, overloadedHandlers?: MockHanders): JSX.Element {
  const row: FACADReports['Row'] = {
    ID: 1,
    BuiltInCategory: 'INVALID',
    ReportType: 'Schedule',
    Name: 'A name',
    PathName: 'A path',
    Field1: '',
    Field2: '',
    Field3: '',
  };

  const field: Field = overloadField || {
    Editable: true,
    Primary: false,
    Name: 'Name',
    Type: 'Text',
    Required: false,
  };

  const handlers: MockHanders = overloadedHandlers || {};
  return (
    <table>
      <tbody>
        <tr>
          <TCell Row={row} Field={field} onEdit={handlers.onEdit} search={handlers.search} isNew={handlers.isNew} />
        </tr>
      </tbody>
    </table>
  );
}

test('Cell renders a normal cell', (): void => {
  const el = prepareMock1();
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
});

test('Cell renders a combobox cell', (): void => {
  const field: Field = {
    Name: 'BuiltInCategory',
    Type: 'Text',
    Primary: false,
    Required: true,
    Editable: true,
    Combobox:{
      Source: 'FACAD-BuiltInCategories',
      Display: 'BuiltInCategory',
      Value: 'BuiltInCategory',
      Params:{
        BuiltInCategory: 'BuiltInCategory'
      }
    }
  };
  const el = prepareMock1(field, { search: searchMock });
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell Search datalist').length).toBe(1);
});

test('Cell renders an empty cell if field is incorrect', (): void => {
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'Name Incorrect',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
});

test('Click over cell renders an input', (): void => {
  const el = prepareMock1();
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test('Click over a primary cell editable - edit', (): void => {
  const field: Field = {
    Editable: true,
    Primary: true,
    Name: 'ID',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test('Click over a new and primary cell non-editable but required - edit', (): void => {
  const field: Field = {
    Editable: false,
    Primary: true,
    Name: 'ID',
    Type: 'Text',
    Required: true,
  }

  const el = prepareMock1(field, {isNew: true});
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test('Click over a cell non-editable - nothing', (): void => {
  const field: Field = {
    Editable: false,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(0);
  expect(wrapper).toMatchSnapshot();
});

test('Cancel edit by pressing ESC', (): void => {
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  wrapper.find('input').simulate('keyup', { key: 'Escape' });
  expect(wrapper.find('TCell input').length).toBe(0);
});

test('Finish edit if blur', (): void => {
  const newValue = 'modified value';
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  wrapper.find('input').simulate('change', { target: { value: newValue } });
  wrapper.find('input').simulate('blur');
  expect(wrapper.find('TCell').text()).toBe(newValue);
  expect(wrapper).toMatchSnapshot();
});

test('Finish edit if Enter', (): void => {
  const newValue = 'modified value';
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'Text',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  wrapper.find('input').simulate('change', { target: { value: newValue } });
  wrapper.find('input').simulate('keyup', { key: 'Enter' });
  expect(wrapper.find('TCell').text()).toBe(newValue);
  expect(wrapper).toMatchSnapshot();
});

test('Finish edit fires onEdit', (): void => {
  const newValue = 'modified value';
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'Text',
    Required: false,
  }

  let onEditReached = false;
  const handlers: MockHanders = {
    onEdit: (Row: Row, column?: keyof Fields, Field?: Field): void => {
      const row = Row as Fields;
      if (column) {
        expect(row[column]).toBe(newValue);
      } else {
        fail();
      }
      onEditReached = true;
    }
  }

  const el = prepareMock1(field, handlers);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(1);
  wrapper.find('input').simulate('change', { target: { value: newValue } });
  wrapper.find('input').simulate('keyup', { key: 'Enter' });
  expect(wrapper.find('TCell').text()).toBe(newValue);
  expect(wrapper).toMatchSnapshot();
  expect(onEditReached).toBe(true);
});
