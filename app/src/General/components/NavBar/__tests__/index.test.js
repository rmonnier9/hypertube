import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { NavBar } from '../';

describe('A suite', () => {
  it('should be selectable by class header', () => {
    const wrapper = shallow(<NavBar />);
    expect(wrapper.is('.navbar')).toBe(true);
  });
});
