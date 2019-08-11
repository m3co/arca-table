
import * as React from 'react';
import { mount } from 'enzyme';

import { TRow } from './TRow';
import { FACADSchedules, Info, Field, Row, Fields } from 'arca-redux';

interface MockHanders {
  onEdit?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  onDelete?: (Row: Row) => void;
}

function prepareMock1(overloadedHandlers?: MockHanders): JSX.Element {
  const row: FACADSchedules["Row"] = {
    ID: 1,
    BuiltInCategory: 'INVALID',
    Name: 'A name',
    PathName: 'A path',
  }

  const handlers: MockHanders = overloadedHandlers || {};

  return (
    <table>
      <tbody>
        <TRow Row={row} Info={Info} onEdit={handlers.onEdit} onRemove={handlers.onDelete} />
      </tbody>
    </table>
  );
}

test('Row renders a normal cell', (): void => {
  const el = prepareMock1();
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
});

test('Click over delete fires the delete function', (): void => {
  let onDeleteReached = false;
  const onDelete = (): void => {
    onDeleteReached = true;
  }
  const el = prepareMock1({ onDelete });
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
  wrapper.find('button').simulate('click');
  wrapper.update();
  expect(onDeleteReached).toBe(true);
  expect(wrapper).toMatchSnapshot();
})

const Info: Info = {
  "Actions": {
    "Delete": true,
    "Insert": true,
    "Update": true,
  },
  "Fields": [
    {
      "Combobox": null,
      "Editable": false,
      "Name": "ID",
      "Primary": true,
      "Required": false,
      "Select": null,
      "Type": "Number",
    },
    {
      "Combobox": null,
      "Editable": true,
      "Name": "Name",
      "Primary": false,
      "Required": true,
      "Select": null,
      "Type": "String",
    },
    {
      "Combobox": null,
      "Editable": true,
      "Name": "BuiltInCategory",
      "Primary": false,
      "Required": true,
      "Select": null,
      "Type": "String",
    },
    {
      "Combobox": null,
      "Editable": true,
      "Name": "PathName",
      "Primary": false,
      "Required": true,
      "Select": null,
      "Type": "String",
    },
  ],
}
