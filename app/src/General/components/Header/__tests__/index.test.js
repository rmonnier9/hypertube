import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Header } from '../';

describe('A suite', () => {
  it('should be selectable by class header', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.is('.header')).toBe(true);
  });

  // it('should be selectable by class "foo"', () => {
  //   expect(shallow(<Foo />).is('.foo')).toBe(true);
  // });
  //
  // it('should mount in a full DOM', () => {
  //   expect(mount(<Foo />).find('.foo').length).toBe(1);
  // });
  //
  // it('should render to static HTML', () => {
  //   expect(render(<Foo />).text()).toEqual('Bar');
  // });
});
