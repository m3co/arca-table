
import * as React from 'react';
import { mount } from 'enzyme';

import { Input } from './Input';

test('Input normally', (): void => {
  const el = (<Input value={'value A'}/>);
  const wrapper = mount(el);
  expect(wrapper).toMatchSnapshot();
});

test('Input changes its value', (): void => {
  const el = (<Input value={'value A'}/>);
  const wrapper = mount(el);
  wrapper.find('input').simulate('change', { target: { value: 'value B' } });
  expect(wrapper).toMatchSnapshot();
});

test('Input changes its numeric value', (): void => {
  const el = (<Input value={10} type="number" />);
  const wrapper = mount(el);
  wrapper.find('input').simulate('change', { target: { value: 20 } });
  expect(wrapper).toMatchSnapshot();
});


test('Input fires onBlur', (): void => {
  const value = 'value A';
  let onBlurReached = false;
  const onBlur = (currentValue: string | number | boolean): void => {
    expect(currentValue).toBe(value);
    onBlurReached = true;
  }
  const el = (<Input value={value} onBlur={onBlur}/>);
  const wrapper = mount(el);
  wrapper.find('input').simulate('blur');
  expect(onBlurReached).toBe(true);
});

test('Input ignores onEnter if altKey', (): void => {
  const value = 'value A';
  const onEnter = (currentValue: string | number | boolean): void => {
    expect(currentValue).toBe(value);
    fail();
  }
  const el = (<Input value={value} onEnter={onEnter}/>);
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Enter', altKey: true });
});

test('Input fires onEnter', (): void => {
  const value = 'value A';
  let onEnterReached = false;
  const onEnter = (currentValue: string | number | boolean): void => {
    expect(currentValue).toBe(value);
    onEnterReached = true;
  }
  const el = (<Input value={value} onEnter={onEnter}/>);
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Enter' });
  expect(onEnterReached).toBe(true);
});

test('Input fires onEsc', (): void => {
  const value = 'value A';
  let onEscReached = false;
  const onEsc = (): void => {
    onEscReached = true;
  }
  const el = (<Input value={value} onEsc={onEsc}/>);
  const wrapper = mount(el);
  wrapper.find('input').simulate('keyup', { key: 'Escape' });
  expect(onEscReached).toBe(true);
});
