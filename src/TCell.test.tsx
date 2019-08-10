
import * as React from 'react';
import { mount } from 'enzyme';

import { TCell } from './TCell';
import { FACADSchedules, Field, Row } from 'arca-redux';

interface MockHanders {
  onEdit?: (Row: Row, column?: keyof Row, Field?: Field) => void;
}

function prepareMock1(overloadField?: Field, overloadedHandlers?: MockHanders): JSX.Element {
  const row: FACADSchedules["Row"] = {
    ID: 1,
    BuiltInCategory: 'INVALID',
    Name: 'A name',
    PathName: 'A path',
  }

  const field: Field = overloadField || {
    Editable: true,
    Primary: false,
    Name: 'Name',
    Type: 'String',
    Required: false,
  }

  const handlers: MockHanders = overloadedHandlers || {}

  return (
    <table>
      <tbody>
        <tr>
          <TCell Row={row} Field={field} onEdit={handlers.onEdit} />
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

test('Cell renders an empty cell if field is incorrect', (): void => {
  const field: Field = {
    Editable: true,
    Primary: false,
    Name: 'Name Incorrect',
    Type: 'String',
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

test('Click over a primary cell - nothing', (): void => {
  const field: Field = {
    Editable: true,
    Primary: true,
    Name: 'ID',
    Type: 'String',
    Required: false,
  }

  const el = prepareMock1(field);
  const wrapper = mount(el);
  wrapper.find('TCell').simulate('click');
  expect(wrapper.find('TCell input').length).toBe(0);
  expect(wrapper).toMatchSnapshot();
});

test('Click over a cell non-editable - nothing', (): void => {
  const field: Field = {
    Editable: false,
    Primary: false,
    Name: 'BuiltInCategory',
    Type: 'String',
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
    Type: 'String',
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
    Type: 'String',
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
    Type: 'String',
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
    Type: 'String',
    Required: false,
  }

  let onEditReached = false;
  const handlers: MockHanders = {
    onEdit: (Row: Row, column?: keyof Row, Field?: Field): void => {
      if (column) {
        expect(Row[column]).toBe(newValue);
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
