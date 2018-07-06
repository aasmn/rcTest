/**
 * Created by oyhanyu on 2018/3/25.
 */
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jsdom from 'jsdom';

configure({ adapter: new Adapter() });

export default {
    setGlobal: function setGlobal(global) {
        if (!global) {
            throw new Error('no global param');
            return;
        }
        const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
        global.document = doc;
        global.window = doc.defaultView;
        
    }
}