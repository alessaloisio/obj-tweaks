# OBJ-TWEAKS

![npm](https://img.shields.io/npm/v/obj-tweaks)
![npm bundle size](https://img.shields.io/bundlephobia/min/obj-tweaks)
[![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Falessaloisio%2Fobj-tweaks)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Falessaloisio%2Fobj-tweaks)

Library to manipulate javascript object

## Installation

```sh
npm i obj-tweaks
```

```js
import 'obj-tweaks';
require('obj-tweaks');
```

## Commands
- {Object}.new().{Commands} => Create a deep copy of your object
- {Object}.find(conditions)
- {Object}.merge(data)
- {Object}.update(conditions, data)
- {Object}.add(position, data)
- {Object}.delete(conditions)
- {Object}.swap(conditions, position)
- {Object}.exist(position)

## Examples
```js
// Working Object

const state = {
  data: {
    users: {
      123456: {
        _id: 123456,
        active: true,
        status: true,
        info: {
          name: 'Alessandro',
          age: 24,
          links: {
            blog: 'https://aloisio.work',
          },
        },
      },
    },
    favourites: {
      234567: {
        _id: 234567,
        active: true,
        status: true,
        info: {
          name: 'Alicia',
          age: 24,
        },
      },
    },
  },
  loading: false,
  error: null,
};
```
### 1. Find
```js
/**
* Simple find
*/

state.find({ active: true })

// output
[
  {
    _id: 123456,
    active: true,
    ...
  },
  {
    _id: 234567,
    active: true,
    ...
  }
]

/**
* If you want information about users who have 24 years
*/

state.find({ age: 24 })

// output
[
  {
    name: 'Alessandro',
    age: 24,
    links: { blog: 'https://aloisio.work' }
  },
  {
    name: 'Alicia',
    age: 24
  }
]

/**
* But if you want the previous object, just add the parent property
*/

state.find({ 'info.age': 24 })

// output
[
  {
    _id: 123456,
    active: true,
    status: true,
    info: { name: 'Alessandro', age: 24, links: [Object] }
  },
  {
    _id: 234567,
    active: true,
    status: true,
    info: { name: 'Alicia', age: 24 }
  }
]
```

### 2. Merge
```js
/**
* Simple merge
*/

state.merge({ 'info.age': 18 })

// output
{
  data: { 
    users: {
      '123456': {
        ...
        info: { age: 18, ... }
      }
    }, 
    favourites: {
      '234567': {
        ...
        info: { age: 18, ... }
      }
    } 
  },
  loading: false,
  error: null
}
```

### 2'. Combine
```js
/**
* Combine find and merge
*/

state.find({ _id: 123456 }).merge({ 'info.age': 18 })

// output
[
  {
    _id: 123456,
    active: true,
    status: true,
    info: { name: 'Alessandro', age: 18, links: [Object] }
  }
]
```

### 3. Update
```js
/**
* Update the working Object
*/

state.update({ _id: 123456 }, { status: false, 'info.age': 18 })

// output
{
  data: { 
    users: {
      '123456': {
        _id: 123456,
        active: true,
        status: false,
        info: { name: 'Alessandro', age: 18, links: [Object] }
      }
    }, 
    favourites: { '234567': [Object] } },
  loading: false,
  error: null
}
```

**Of course**, you can also add more conditions on find option and how many you want of depth for sub properties.

### 4. Add
```js
/**
* Add an element
*/

state.add('users', {
  987665: {
    _id: 987665,
    active: true,
    status: true,
    info: {
      name: 'Serge',
      age: 40,
    },
  },
})

// output
{
  data: {
    favourites: {
      234567: {
        _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
      },
    },
    users: {
      123456: {
        _id: 123456, active: true, info: { age: 24, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' }, status: true,
      },
      987665: {
        _id: 987665, active: true, info: { age: 40, name: 'Serge' }, status: true,
      },
    },
  },
  error: null,
  loading: false,
}
```

### 5. Delete
```js
/**
* Delete an element
*/

state.delete({ _id: 123456 })

// output
{
  data: {
    favourites: {
      234567: {
        _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
      },
    },
    users: {},
  },
  error: null,
  loading: false,
}
```

### 6. Swap
```js
/**
* Swap an element
*/

state.swap({ _id: 123456 }, 'favourites')

// output
{
  data: {
    favourites: {
      123456: {
        _id: 123456, active: true, info: { age: 24, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' }, status: true,
      },
      234567: {
        _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
      },
    },
    users: {},
  },
  error: null,
  loading: false,
}
```

### 7. Exist
```js
/**
* Determine if an element exist
*/

state.exist('users.123456')
// output
true

state.exist('users.987544')
// output
false
```

# License

MIT © Aloisio Alessandro
