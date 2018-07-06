import React from 'react';
import config from './config';
import ClearableInput from '../component/clearableInput';
import { shallow, mount } from 'enzyme';


describe('antd form test', () => {
    let formWrapped;
    let instance;
    let wrapper;
    let input;
    beforeAll(() => {
        
        config.setGlobal(global);
        wrapper = mount(<ClearableInput />);
        instance = wrapper.instance();
        input = shallow(<ClearableInput />);
        //formWrapped = instance.refs.wrappedComponent.refs.formWrappedComponent;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    it('search params test', () => {
        expect("wrapper.state.searchParams1").toBeTruthy();
    });
 

});
