import ObjUtils from './ObjUtils';

/**
   * PROTOTYPES
   */
const cmds = ['new', 'update', 'find', 'add', 'merge', 'exist', 'delete', 'swap'];

cmds.map(cmd => {
  // eslint-disable-next-line no-extend-native
  Object.prototype[cmd] = function (...props) {
    // last element is a toggle to create a new Object
    let newObj;
    if (typeof props[props.length - 1] === 'boolean') {
      newObj = props.pop();
    } else if (cmd === 'new') {
      newObj = true;
    } else {
      newObj = ObjUtils.newObj;
    }

    const self = newObj ? JSON.parse(JSON.stringify(this)) : this;
    const element = new ObjUtils(self);

    let conditions, data, position;

    switch (cmd) {
      case 'update':
        [conditions, data] = props;
        element.find(conditions).merge(data);
        break;

      case 'add':
        [position, data] = props;
        element.add(position, data);
        break;

      case 'find':
        [conditions] = props;
        return element.find(conditions);

      case 'merge':
        [data] = props;
        return element.merge(data);

      case 'exist':
        [data] = props;
        return !!element.find({
          [data]: '$exist',
        }).length;

      case 'delete':
        [conditions] = props;
        element.delete(conditions);
        break;

      case 'swap':
        [conditions, position] = props;
        element.swap(conditions, position);
        break;

      default:
      // console.log('Command not found', cmd);
    }

    return element.obj;
  };

  return true;
});
